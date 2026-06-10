// // server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const twilio = require('twilio');

const app = express();

const DATA_DIR = path.join(__dirname, 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'poker-memory.json');
const MAX_HISTORY_ITEMS = 100;

const SMS_ENABLED = String(process.env.SMS_ENABLED || '').toLowerCase() === 'true';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_FROM || '';
const ALERT_TO = process.env.ALERT_TO || '';
const twilioClient = (SMS_ENABLED && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

function ensureMemoryStore() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(MEMORY_FILE)) {
        const initial = {
            players: {},
            handHistory: [],
            meta: { updatedAt: new Date().toISOString() }
        };
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
}

function readMemory() {
    try {
        ensureMemoryStore();
        const raw = fs.readFileSync(MEMORY_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.players) parsed.players = {};
        if (!Array.isArray(parsed.handHistory)) parsed.handHistory = [];
        if (!parsed.meta) parsed.meta = {};
        return parsed;
    } catch (err) {
        console.error('Failed reading memory store:', err);
        return { players: {}, handHistory: [], meta: {} };
    }
}

function writeMemory(memory) {
    try {
        ensureMemoryStore();
        memory.meta = { ...(memory.meta || {}), updatedAt: new Date().toISOString() };
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), 'utf-8');
    } catch (err) {
        console.error('Failed writing memory store:', err);
    }
}

function getPlayerKey(name) {
    return String(name || '').trim().toLowerCase();
}

function ensurePlayerStats(memory, playerName) {
    const key = getPlayerKey(playerName);
    if (!key) return null;
    if (!memory.players[key]) {
        memory.players[key] = {
            name: String(playerName || '').trim(),
            handsPlayed: 0,
            handsWon: 0,
            chipsWon: 0,
            chipsLost: 0,
            netChips: 0,
            lastSeen: new Date().toISOString()
        };
    }
    return memory.players[key];
}

function clampHistory(memory) {
    if (memory.handHistory.length > MAX_HISTORY_ITEMS) {
        memory.handHistory = memory.handHistory.slice(memory.handHistory.length - MAX_HISTORY_ITEMS);
    }
}

async function sendSmsAlert(message) {
    if (!twilioClient || !TWILIO_FROM || !ALERT_TO) return;
    try {
        await twilioClient.messages.create({
            body: message,
            from: TWILIO_FROM,
            to: ALERT_TO
        });
    } catch (err) {
        console.error('SMS alert failed:', err.message || err);
    }
}

ensureMemoryStore();

// Trust reverse proxy headers in production hosts (Render/Railway/Heroku/etc)
app.set('trust proxy', 1);

const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || '*';
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});

// Health endpoint for uptime/monitoring checks
app.get('/health', (req, res) => {
    res.status(200).json({
        ok: true,
        service: 'poker-server',
        players: players.length,
        phase: gamePhase
    });
});

app.get('/stats/:name', (req, res) => {
    const memory = readMemory();
    const key = getPlayerKey(req.params.name);
    if (!key || !memory.players[key]) {
        return res.status(404).json({ ok: false, error: 'Player stats not found' });
    }
    return res.status(200).json({ ok: true, player: memory.players[key] });
});

app.get('/leaderboard', (req, res) => {
    const memory = readMemory();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 10, 100));
    const leaderboard = Object.values(memory.players)
        .sort((a, b) => {
            if (b.netChips !== a.netChips) return b.netChips - a.netChips;
            return b.chipsWon - a.chipsWon;
        })
        .slice(0, limit);

    return res.status(200).json({ ok: true, count: leaderboard.length, leaderboard });
});

app.get('/history', (req, res) => {
    const memory = readMemory();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 20, 100));
    const history = memory.handHistory.slice(-limit).reverse();
    return res.status(200).json({ ok: true, count: history.length, history });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ============ GAME CONSTANTS ============
const MAX_PLAYERS = 7;
const STARTING_STACK = 1500;
const SMALL_BLIND = 1;
const BIG_BLIND = 2;
const ACTION_TIMEOUT = 30000;

// ============ CARD UTILITIES ============
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const value of VALUES) {
            deck.push({
                suit,
                value,
                numericValue: getNumericValue(value),
                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
            });
        }
    }
    return shuffle(deck);
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getNumericValue(value) {
    const faceCards = { 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    return faceCards[value] || parseInt(value);
}

function getSuitSymbol(suit) {
    const symbols = { 'hearts': '♥', 'diamonds': '♦', 'clubs': '♣', 'spades': '♠' };
    return symbols[suit];
}

// ============ HAND EVALUATOR ============
const HAND_RANKS = {
    HIGH_CARD: 1,
    ONE_PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_A_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_A_KIND: 8,
    STRAIGHT_FLUSH: 9,
    ROYAL_FLUSH: 10
};

const HAND_NAMES = {
    1: 'High Card',
    2: 'One Pair',
    3: 'Two Pair',
    4: 'Three of a Kind',
    5: 'Straight',
    6: 'Flush',
    7: 'Full House',
    8: 'Four of a Kind',
    9: 'Straight Flush',
    10: 'Royal Flush'
};

function getCombinations(arr, size) {
    const result = [];
    function combine(start, combo) {
        if (combo.length === size) {
            result.push([...combo]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            combine(i + 1, combo);
            combo.pop();
        }
    }
    combine(0, []);
    return result;
}

function evaluateHand(holeCards, communityCards) {
    const allCards = [...holeCards, ...communityCards];
    if (allCards.length < 5) return null;
    
    const combinations = getCombinations(allCards, 5);
    let bestHand = null;
    let bestRank = { rank: 0, tiebreaker: [] };

    for (const combo of combinations) {
        const rank = rankHand(combo);
        if (compareHands(rank, bestRank) > 0) {
            bestRank = rank;
            bestHand = combo;
        }
    }

    return {
        hand: bestHand,
        rank: bestRank.rank,
        rankName: HAND_NAMES[bestRank.rank],
        tiebreaker: bestRank.tiebreaker,
        score: bestRank.rank * 1000000 + tiebreakerToScore(bestRank.tiebreaker)
    };
}

function tiebreakerToScore(tiebreaker) {
    let score = 0;
    for (let i = 0; i < tiebreaker.length; i++) {
        score += tiebreaker[i] * Math.pow(15, 4 - i);
    }
    return score;
}

function rankHand(cards) {
    const values = cards.map(c => c.numericValue).sort((a, b) => b - a);
    const suits = cards.map(c => c.suit);
    
    const valueCounts = {};
    for (const v of values) {
        valueCounts[v] = (valueCounts[v] || 0) + 1;
    }
    
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
    
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = checkStraight(uniqueValues);
    const isLowStraight = checkLowStraight(uniqueValues);

    // Royal Flush
    if (isFlush && isStraight && values.includes(14) && values.includes(13)) {
        return { rank: HAND_RANKS.ROYAL_FLUSH, tiebreaker: [14] };
    }

    // Straight Flush
    if (isFlush && (isStraight || isLowStraight)) {
        const highCard = isLowStraight ? 5 : Math.max(...values);
        return { rank: HAND_RANKS.STRAIGHT_FLUSH, tiebreaker: [highCard] };
    }

    // Four of a Kind
    if (counts[0] === 4) {
        const quadValue = parseInt(Object.keys(valueCounts).find(k => valueCounts[k] === 4));
        const kicker = values.find(v => v !== quadValue);
        return { rank: HAND_RANKS.FOUR_OF_A_KIND, tiebreaker: [quadValue, kicker] };
    }

    // Full House
    if (counts[0] === 3 && counts[1] === 2) {
        const tripValue = parseInt(Object.keys(valueCounts).find(k => valueCounts[k] === 3));
        const pairValue = parseInt(Object.keys(valueCounts).find(k => valueCounts[k] === 2));
        return { rank: HAND_RANKS.FULL_HOUSE, tiebreaker: [tripValue, pairValue] };
    }

    // Flush
    if (isFlush) {
        return { rank: HAND_RANKS.FLUSH, tiebreaker: values };
    }

    // Straight
    if (isStraight || isLowStraight) {
        const highCard = isLowStraight ? 5 : Math.max(...values);
        return { rank: HAND_RANKS.STRAIGHT, tiebreaker: [highCard] };
    }

    // Three of a Kind
    if (counts[0] === 3) {
        const tripValue = parseInt(Object.keys(valueCounts).find(k => valueCounts[k] === 3));
        const kickers = values.filter(v => v !== tripValue).slice(0, 2);
        return { rank: HAND_RANKS.THREE_OF_A_KIND, tiebreaker: [tripValue, ...kickers] };
    }

    // Two Pair
    if (counts[0] === 2 && counts[1] === 2) {
        const pairs = Object.keys(valueCounts)
            .filter(k => valueCounts[k] === 2)
            .map(Number)
            .sort((a, b) => b - a);
        const kicker = values.find(v => !pairs.includes(v));
        return { rank: HAND_RANKS.TWO_PAIR, tiebreaker: [...pairs, kicker] };
    }

    // One Pair
    if (counts[0] === 2) {
        const pairValue = parseInt(Object.keys(valueCounts).find(k => valueCounts[k] === 2));
        const kickers = values.filter(v => v !== pairValue).slice(0, 3);
        return { rank: HAND_RANKS.ONE_PAIR, tiebreaker: [pairValue, ...kickers] };
    }

    // High Card
    return { rank: HAND_RANKS.HIGH_CARD, tiebreaker: values };
}

function checkStraight(uniqueValues) {
    if (uniqueValues.length !== 5) return false;
    return uniqueValues[0] - uniqueValues[4] === 4;
}

function checkLowStraight(uniqueValues) {
    const wheel = [14, 5, 4, 3, 2];
    return uniqueValues.length === 5 && wheel.every(v => uniqueValues.includes(v));
}

function compareHands(hand1, hand2) {
    if (hand1.rank !== hand2.rank) {
        return hand1.rank - hand2.rank;
    }
    for (let i = 0; i < hand1.tiebreaker.length; i++) {
        if (hand1.tiebreaker[i] !== hand2.tiebreaker[i]) {
            return hand1.tiebreaker[i] - hand2.tiebreaker[i];
        }
    }
    return 0;
}

// ============ GAME STATE ============
let players = [];
let deck = [];
let communityCards = [];
let pot = 0;
let currentBet = 0;
let minRaise = BIG_BLIND;
let gamePhase = 'waiting'; // waiting, preflop, flop, turn, river, showdown
let dealerIndex = 0;
let currentPlayerIndex = 0;
let lastRaiserIndex = -1;
let actedThisRound = new Set();
let actionTimer = null;

// ============ HELPER FUNCTIONS ============
function getPlayer(socketId) {
    return players.find(p => p.id === socketId);
}

function getActivePlayersInHand() {
    return players.filter(p => !p.folded && p.isActive);
}

function getNextActivePlayerIndex(fromIndex) {
    if (players.length === 0) return -1;
    
    let index = (fromIndex + 1) % players.length;
    let attempts = 0;
    
    while (attempts < players.length) {
        const player = players[index];
        if (player && !player.folded && player.isActive && !player.allIn) {
            return index;
        }
        index = (index + 1) % players.length;
        attempts++;
    }
    return -1;
}

function getFirstAvailableSeat() {
    const takenSeats = players.map(p => p.seat);
    for (let i = 0; i < MAX_PLAYERS; i++) {
        if (!takenSeats.includes(i)) return i;
    }
    return -1;
}

function canStartGame() {
    const playersWithChips = players.filter(p => p.stack > 0);
    return playersWithChips.length >= 2;
}

function maybeAutoStartFromWaiting(delayMs = 1500) {
    if (gamePhase !== 'waiting' || !canStartGame()) return false;

    // If a hand is already effectively in progress from previous state, do not start another.
    if (deck.length > 0 || communityCards.length > 0 || pot > 0) {
        return false;
    }

    if (delayMs <= 0) {
        startNewHand();
        return true;
    }

    setTimeout(() => {
        if (gamePhase === 'waiting' && canStartGame() && deck.length === 0 && communityCards.length === 0 && pot === 0) {
            startNewHand();
        }
    }, delayMs);

    return true;
}

function broadcast(event, data) {
    io.emit(event, data);
}

function getPublicState() {
    return {
        phase: gamePhase,
        pot: pot,
        communityCards: communityCards,
        currentBet: currentBet,
        minRaise: minRaise,
        dealerSeat: players[dealerIndex]?.seat,
        currentPlayerSeat: players[currentPlayerIndex]?.seat,
        players: players.map(p => ({
            seat: p.seat,
            name: p.name,
            avatar: p.avatar || '👤',
            stack: p.stack,
            currentBet: p.currentBet,
            folded: p.folded,
            allIn: p.allIn,
            isActive: p.isActive,
            lastAction: p.lastAction,
            hasCards: p.cards.length > 0 && !p.folded
        }))
    };
}

function getAvailableActions(player) {
    if (!player || player.folded || player.allIn) return [];
    
    const playerIndex = players.indexOf(player);
    if (playerIndex !== currentPlayerIndex) return [];
    if (gamePhase === 'waiting' || gamePhase === 'showdown') return [];

    const actions = ['fold'];
    const toCall = currentBet - player.currentBet;

    if (toCall === 0) {
        actions.push('check');
    } else if (toCall > 0 && toCall <= player.stack) {
        actions.push('call');
    }

    if (currentBet === 0 && player.stack >= BIG_BLIND) {
        actions.push('bet');
    }

    if (currentBet > 0 && player.stack > toCall) {
        actions.push('raise');
    }

    if (player.stack > 0) {
        actions.push('allin');
    }

    return actions;
}

function broadcastGameState() {
    const state = getPublicState();
    broadcast('game_state', state);

    players.forEach(player => {
        io.to(player.id).emit('private_state', {
            myCards: player.cards,
            mySeat: player.seat,
            myStack: player.stack,
            isMyTurn: players[currentPlayerIndex]?.id === player.id,
            availableActions: getAvailableActions(player),
            toCall: currentBet - player.currentBet
        });
    });
}

function clearActionTimer() {
    if (actionTimer) {
        clearTimeout(actionTimer);
        actionTimer = null;
    }
}

function startActionTimer() {
    clearActionTimer();
    
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    broadcast('timer_start', {
        seat: currentPlayer.seat,
        duration: ACTION_TIMEOUT
    });

    actionTimer = setTimeout(() => {
        handleAction(currentPlayer.id, 'fold');
        broadcast('system_msg', `${currentPlayer.name} timed out and folded.`);
    }, ACTION_TIMEOUT);
}

// ============ GAME FLOW ============
function startNewHand() {
    if (!canStartGame()) {
        broadcast('system_msg', 'Not enough players with chips to start.');
        return false;
    }

    clearActionTimer();

    // Reset deck and community cards
    deck = createDeck();
    communityCards = [];
    pot = 0;
    currentBet = 0;
    minRaise = BIG_BLIND;
    lastRaiserIndex = -1;
    actedThisRound.clear();

    // Reset player states
    players.forEach(p => {
        p.cards = [];
        p.currentBet = 0;
        p.totalBetThisHand = 0;
        p.folded = p.stack === 0;
        p.allIn = false;
        p.isActive = p.stack > 0;
        p.lastAction = null;
        p.showCards = false;
    });

    // Move dealer button
    moveDealerButton();

    // Post blinds
    postBlinds();

    // Deal hole cards
    dealHoleCards();

    // Set game phase
    gamePhase = 'preflop';

    // Set first actor
    setFirstActor();

    // Broadcast
    broadcastGameState();
    broadcast('hand_started', { dealer: dealerIndex });

    // Start timer
    startActionTimer();

    return true;
}

function moveDealerButton() {
    const activePlayers = players.filter(p => p.stack > 0 || p.allIn);
    if (activePlayers.length === 0) return;

    let attempts = 0;
    do {
        dealerIndex = (dealerIndex + 1) % players.length;
        attempts++;
    } while (players[dealerIndex]?.stack === 0 && attempts < players.length);
}

function postBlinds() {
    const activePlayers = getActivePlayersInHand();
    if (activePlayers.length < 2) return;

    let smallBlindIndex, bigBlindIndex;

    if (activePlayers.length === 2) {
        smallBlindIndex = dealerIndex;
        bigBlindIndex = getNextActivePlayerIndex(dealerIndex);
    } else {
        smallBlindIndex = getNextActivePlayerIndex(dealerIndex);
        bigBlindIndex = getNextActivePlayerIndex(smallBlindIndex);
    }

    if (smallBlindIndex === -1 || bigBlindIndex === -1) return;

    // Post small blind
    const sbPlayer = players[smallBlindIndex];
    const sbAmount = Math.min(SMALL_BLIND, sbPlayer.stack);
    playerBet(sbPlayer, sbAmount);
    sbPlayer.lastAction = 'SB';

    // Post big blind
    const bbPlayer = players[bigBlindIndex];
    const bbAmount = Math.min(BIG_BLIND, bbPlayer.stack);
    playerBet(bbPlayer, bbAmount);
    bbPlayer.lastAction = 'BB';

    currentBet = BIG_BLIND;
    minRaise = BIG_BLIND;

    broadcast('blinds_posted', {
        smallBlind: { seat: sbPlayer.seat, amount: sbAmount },
        bigBlind: { seat: bbPlayer.seat, amount: bbAmount }
    });
}

function dealHoleCards() {
    const activePlayers = getActivePlayersInHand();
    
    for (let i = 0; i < 2; i++) {
        for (const player of activePlayers) {
            player.cards.push(deck.shift());
        }
    }

    activePlayers.forEach(p => {
        io.to(p.id).emit('hole_cards', { cards: p.cards });
    });
}

function setFirstActor() {
    const activePlayers = getActivePlayersInHand();
    
    if (gamePhase === 'preflop') {
        let bbIndex;
        if (activePlayers.length === 2) {
            bbIndex = getNextActivePlayerIndex(dealerIndex);
        } else {
            bbIndex = getNextActivePlayerIndex(getNextActivePlayerIndex(dealerIndex));
        }
        currentPlayerIndex = getNextActivePlayerIndex(bbIndex);
    } else {
        currentPlayerIndex = getNextActivePlayerIndex(dealerIndex);
    }

    if (currentPlayerIndex === -1) {
        currentPlayerIndex = 0;
    }
}

function playerBet(player, amount) {
    const actualAmount = Math.min(amount, player.stack);
    player.stack -= actualAmount;
    player.currentBet += actualAmount;
    player.totalBetThisHand += actualAmount;
    pot += actualAmount;

    if (player.stack === 0) {
        player.allIn = true;
    }
}

// ============ ACTION HANDLERS ============
function handleAction(socketId, action, amount = 0) {
    const player = getPlayer(socketId);
    if (!player) return { success: false, error: 'Player not found' };

    const playerIndex = players.indexOf(player);
    if (playerIndex !== currentPlayerIndex) {
        return { success: false, error: 'Not your turn' };
    }

    if (player.folded || player.allIn) {
        return { success: false, error: 'Cannot act' };
    }

    clearActionTimer();

    let result;
    switch (action) {
        case 'fold':
            result = handleFold(player);
            break;
        case 'check':
            result = handleCheck(player);
            break;
        case 'call':
            result = handleCall(player);
            break;
        case 'bet':
            result = handleBet(player, amount);
            break;
        case 'raise':
            result = handleRaise(player, amount);
            break;
        case 'allin':
            result = handleAllIn(player);
            break;
        default:
            result = { success: false, error: 'Invalid action' };
    }

    if (result.success) {
        actedThisRound.add(player.id);
        
        broadcast('player_action', {
            seat: player.seat,
            action: action,
            amount: result.amount || 0,
            playerStack: player.stack
        });

        if (checkForWinByDefault()) {
            return result;
        }

        advanceGame();
    }

    return result;
}

function handleFold(player) {
    player.folded = true;
    player.lastAction = 'FOLD';
    return { success: true };
}

function handleCheck(player) {
    if (player.currentBet < currentBet) {
        return { success: false, error: 'Cannot check - must call or raise' };
    }
    player.lastAction = 'CHECK';
    return { success: true };
}

function handleCall(player) {
    const toCall = currentBet - player.currentBet;
    
    if (toCall <= 0) {
        return { success: false, error: 'Nothing to call' };
    }

    const actualCall = Math.min(toCall, player.stack);
    playerBet(player, actualCall);
    player.lastAction = 'CALL';

    return { success: true, amount: actualCall };
}

function handleBet(player, amount) {
    if (currentBet > 0) {
        return { success: false, error: 'Use raise instead' };
    }

    if (amount < BIG_BLIND) {
        amount = BIG_BLIND;
    }

    if (amount > player.stack) {
        amount = player.stack;
    }

    playerBet(player, amount);
    currentBet = player.currentBet;
    minRaise = amount;
    lastRaiserIndex = players.indexOf(player);
    actedThisRound.clear();
    actedThisRound.add(player.id);
    player.lastAction = `BET ${amount}`;

    return { success: true, amount: amount };
}

function handleRaise(player, amount) {
    const toCall = currentBet - player.currentBet;

    if (amount < currentBet + minRaise && amount < player.stack + player.currentBet) {
        amount = currentBet + minRaise;
    }

    if (amount > player.stack + player.currentBet) {
        amount = player.stack + player.currentBet;
    }

    const actualBet = amount - player.currentBet;
    playerBet(player, actualBet);
    
    const raiseAmount = player.currentBet - currentBet;
    if (raiseAmount > minRaise) {
        minRaise = raiseAmount;
    }
    
    currentBet = player.currentBet;
    lastRaiserIndex = players.indexOf(player);
    actedThisRound.clear();
    actedThisRound.add(player.id);
    player.lastAction = `RAISE ${amount}`;

    return { success: true, amount: actualBet };
}

function handleAllIn(player) {
    const allInAmount = player.stack;
    playerBet(player, allInAmount);
    
    if (player.currentBet > currentBet) {
        const raiseAmount = player.currentBet - currentBet;
        if (raiseAmount >= minRaise) {
            minRaise = raiseAmount;
        }
        currentBet = player.currentBet;
        lastRaiserIndex = players.indexOf(player);
        actedThisRound.clear();
        actedThisRound.add(player.id);
    }
    
    player.lastAction = 'ALL-IN';

    return { success: true, amount: allInAmount };
}

// ============ GAME ADVANCEMENT ============
function advanceGame() {
    if (isBettingRoundComplete()) {
        advancePhase();
    } else {
        const nextIndex = getNextActivePlayerIndex(currentPlayerIndex);
        if (nextIndex !== -1) {
            currentPlayerIndex = nextIndex;
        }
        broadcastGameState();
        startActionTimer();
    }
}

function isBettingRoundComplete() {
    const activePlayers = getActivePlayersInHand().filter(p => !p.allIn);
    
    if (activePlayers.length === 0) return true;
    if (activePlayers.length === 1 && currentBet === activePlayers[0].currentBet) {
        return true;
    }

    for (const player of activePlayers) {
        if (!actedThisRound.has(player.id)) return false;
        if (player.currentBet !== currentBet) return false;
    }

    return true;
}

function advancePhase() {
    currentBet = 0;
    minRaise = BIG_BLIND;
    lastRaiserIndex = -1;
    actedThisRound.clear();
    
    players.forEach(p => {
        p.currentBet = 0;
        p.lastAction = null;
    });

    switch (gamePhase) {
        case 'preflop':
            dealFlop();
            break;
        case 'flop':
            dealTurn();
            break;
        case 'turn':
            dealRiver();
            break;
        case 'river':
            showdown();
            return;
    }

    setFirstActor();
    
    const activeNonAllIn = getActivePlayersInHand().filter(p => !p.allIn);
    if (activeNonAllIn.length <= 1) {
        runOutBoard();
        return;
    }

    broadcastGameState();
    startActionTimer();
}

function dealFlop() {
    deck.shift(); // Burn
    communityCards.push(deck.shift(), deck.shift(), deck.shift());
    gamePhase = 'flop';
    broadcast('community_cards', { cards: communityCards, phase: 'flop' });
}

function dealTurn() {
    deck.shift(); // Burn
    communityCards.push(deck.shift());
    gamePhase = 'turn';
    broadcast('community_cards', { cards: communityCards, phase: 'turn' });
}

function dealRiver() {
    deck.shift(); // Burn
    communityCards.push(deck.shift());
    gamePhase = 'river';
    broadcast('community_cards', { cards: communityCards, phase: 'river' });
}

function runOutBoard() {
    while (communityCards.length < 5) {
        deck.shift();
        communityCards.push(deck.shift());
    }
    
    broadcast('community_cards', { cards: communityCards, phase: 'runout' });
    setTimeout(() => showdown(), 2000);
}

function showdown() {
    gamePhase = 'showdown';
    clearActionTimer();

    const activePlayers = getActivePlayersInHand();
    
    const playerHands = activePlayers.map(player => {
        const evaluation = evaluateHand(player.cards, communityCards);
        return {
            player,
            ...evaluation
        };
    });

    playerHands.sort((a, b) => b.score - a.score);

    const winners = [playerHands[0]];
    for (let i = 1; i < playerHands.length; i++) {
        if (playerHands[i].score === playerHands[0].score) {
            winners.push(playerHands[i]);
        } else {
            break;
        }
    }

    const potBeforePayout = pot;
    const winAmount = Math.floor(pot / winners.length);
    const remainder = pot % winners.length;

    winners.forEach((w, index) => {
        const bonus = index === 0 ? remainder : 0;
        w.player.stack += winAmount + bonus;
        w.winAmount = winAmount + bonus;
    });

    const showdownData = {
        winners: winners.map(w => ({
            seat: w.player.seat,
            name: w.player.name,
            cards: w.player.cards,
            handName: w.rankName,
            winAmount: w.winAmount
        })),
        allHands: playerHands.map(ph => ({
            seat: ph.player.seat,
            name: ph.player.name,
            cards: ph.player.cards,
            handName: ph.rankName
        })),
        pot: pot
    };

    // Persist lifetime stats and hand history
    const memory = readMemory();
    const participants = playerHands.map(ph => {
        const st = ensurePlayerStats(memory, ph.player.name);
        if (st) {
            st.handsPlayed += 1;
            st.chipsLost += ph.player.totalBetThisHand || 0;
            st.netChips = st.chipsWon - st.chipsLost;
            st.lastSeen = new Date().toISOString();
        }
        return {
            seat: ph.player.seat,
            name: ph.player.name,
            totalBet: ph.player.totalBetThisHand || 0,
            handName: ph.rankName
        };
    });

    winners.forEach(w => {
        const st = ensurePlayerStats(memory, w.player.name);
        if (st) {
            st.handsWon += 1;
            st.chipsWon += w.winAmount || 0;
            st.netChips = st.chipsWon - st.chipsLost;
            st.lastSeen = new Date().toISOString();
        }
    });

    memory.handHistory.push({
        timestamp: new Date().toISOString(),
        phase: 'showdown',
        pot: potBeforePayout,
        winners: winners.map(w => ({
            seat: w.player.seat,
            name: w.player.name,
            handName: w.rankName,
            winAmount: w.winAmount
        })),
        participants
    });
    clampHistory(memory);
    writeMemory(memory);

    broadcast('showdown', showdownData);
    pot = 0;
    gamePhase = 'waiting';

    setTimeout(() => {
        if (canStartGame()) {
            startNewHand();
        } else {
            broadcastGameState();
        }
    }, 5000);
}

function checkForWinByDefault() {
    const activePlayers = getActivePlayersInHand();
    
    if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        const potBeforePayout = pot;
        winner.stack += pot;

        broadcast('win_by_default', {
            winner: {
                seat: winner.seat,
                name: winner.name,
                amount: pot
            }
        });

        // Persist default-win stats/history
        const memory = readMemory();

        players.forEach(p => {
            if (!p.isActive) return;
            const st = ensurePlayerStats(memory, p.name);
            if (!st) return;
            st.handsPlayed += 1;
            st.chipsLost += p.totalBetThisHand || 0;
            st.netChips = st.chipsWon - st.chipsLost;
            st.lastSeen = new Date().toISOString();
        });

        const winnerStats = ensurePlayerStats(memory, winner.name);
        if (winnerStats) {
            winnerStats.handsWon += 1;
            winnerStats.chipsWon += potBeforePayout;
            winnerStats.netChips = winnerStats.chipsWon - winnerStats.chipsLost;
            winnerStats.lastSeen = new Date().toISOString();
        }

        memory.handHistory.push({
            timestamp: new Date().toISOString(),
            phase: 'win_by_default',
            pot: potBeforePayout,
            winners: [{
                seat: winner.seat,
                name: winner.name,
                handName: 'Win by Default',
                winAmount: potBeforePayout
            }],
            participants: players
                .filter(p => p.isActive)
                .map(p => ({
                    seat: p.seat,
                    name: p.name,
                    totalBet: p.totalBetThisHand || 0,
                    folded: !!p.folded
                }))
        });
        clampHistory(memory);
        writeMemory(memory);

        pot = 0;
        gamePhase = 'waiting';
        clearActionTimer();

        setTimeout(() => {
            if (canStartGame()) {
                startNewHand();
            } else {
                broadcastGameState();
            }
        }, 3000);

        return true;
    }

    return false;
}

// ============ SOCKET HANDLERS ============
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Join game
    socket.on('join_game', (payload) => {
        const username = typeof payload === 'string' ? payload : (payload && payload.username);
        const avatar = (payload && payload.avatar) || '👤';

        if (!username || username.trim().length < 2) {
            socket.emit('join_error', 'Name must be at least 2 characters');
            return;
        }

        if (players.length >= MAX_PLAYERS) {
            socket.emit('join_error', 'Table is full');
            return;
        }

        const existingPlayer = players.find(p => 
            p.name.toLowerCase() === username.trim().toLowerCase()
        );
        if (existingPlayer) {
            socket.emit('join_error', 'Name already taken');
            return;
        }

        const seat = getFirstAvailableSeat();
        const player = {
            id: socket.id,
            name: username.trim(),
            stack: STARTING_STACK,
            seat: seat,
            cards: [],
            currentBet: 0,
            totalBetThisHand: 0,
            folded: false,
            allIn: false,
            isActive: true,
            lastAction: null,
            avatar: avatar
        };

        players.push(player);
        players.sort((a, b) => a.seat - b.seat);

        socket.emit('join_success', {
            player: player,
            gameState: getPublicState()
        });

        broadcastGameState();
        broadcast('system_msg', `${username} joined the table!`);

        sendSmsAlert(`[Poker] ${username} joined the table. Players now: ${players.length}.`);

        // Auto-start game
        maybeAutoStartFromWaiting(3000);
    });

    // Player action
    socket.on('player_action', (data) => {
        const result = handleAction(socket.id, data.action, data.amount);
        if (!result.success) {
            socket.emit('action_error', result.error);
        }
    });

    // Chat
    socket.on('send_chat', (message) => {
        const player = getPlayer(socket.id);
        if (player && message && message.trim()) {
            io.emit('chat_message', {
                seat: player.seat,
                name: player.name,
                message: message.trim().substring(0, 100),
                timestamp: Date.now()
            });
        }
    });

    // Emoji
    socket.on('send_emoji', (emoji) => {
        const player = getPlayer(socket.id);
        if (player && emoji) {
            io.emit('emoji_reaction', {
                seat: player.seat,
                emoji: emoji
            });
        }
    });

    // Rebuy
    socket.on('request_rebuy', () => {
        const player = getPlayer(socket.id);
        if (!player) {
            socket.emit('rebuy_error', 'Player not found');
            return;
        }

        if (player.stack > 0) {
            socket.emit('rebuy_error', 'You can only rebuy when you have 0 chips');
            return;
        }

        // Simulate payment success
        player.stack = STARTING_STACK;
        
        player.isActive = player.stack > 0;
        player.folded = false;
        player.allIn = false;
        player.cards = [];
        player.currentBet = 0;
        player.totalBetThisHand = 0;
        player.lastAction = null;

        socket.emit('rebuy_success', 'Rebuy successful! +1,500 chips');
        broadcastGameState();
        broadcast('system_msg', `${player.name} bought more chips!`);

        // If table is idle and now has enough stacks, resume automatically.
        // If for any reason delayed path does not trigger, force-start as fallback.
        const started = maybeAutoStartFromWaiting(0);
        if (!started && gamePhase === 'waiting' && canStartGame()) {
            startNewHand();
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        const playerIndex = players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
            const player = players[playerIndex];
            players.splice(playerIndex, 1);

            if (players.length > 0 && dealerIndex >= players.length) {
                dealerIndex = 0;
            }

            broadcast('system_msg', `${player.name} left the table.`);
            
            if (gamePhase !== 'waiting' && gamePhase !== 'showdown') {
                if (playerIndex === currentPlayerIndex) {
                    advanceGame();
                }
                checkForWinByDefault();
            }
            
            broadcastGameState();
        }
        console.log(`Player disconnected: ${socket.id}`);
    });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`\n🃏 Texas Hold'em Poker Server`);
    console.log(`   Running on http://${HOST}:${PORT}`);
    console.log(`   Blinds: ${SMALL_BLIND}/${BIG_BLIND}`);
    console.log(`   Buy-in: ${STARTING_STACK} chips`);
    console.log(`   Allowed origin: ${allowedOrigin}\n`);

    if (SMS_ENABLED) {
        sendSmsAlert(`[Poker] Server started on ${HOST}:${PORT}.`);
    }
});

// Graceful shutdown for managed hosting platforms
function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    clearActionTimer();
    io.close(() => {
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });

    // Force exit if not closed in time
    setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
