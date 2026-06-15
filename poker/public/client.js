// poker-multiplayer/public/client.js
const configuredServerUrl = (window.POKER_SERVER_URL || '').trim();
const socket = configuredServerUrl
    ? io(configuredServerUrl, { transports: ['websocket', 'polling'] })
    : io({ transports: ['websocket', 'polling'] });

let socketConnected = false;
const soundManager = new SoundManager();
const animationManager = new AnimationManager();

let myName = '';
let mySeat = -1;
let gameState = null;
let privateState = null;
let chatEnabled = true;
let soundEnabled = true;
let pendingBetAction = null;
let selectedAvatar = '👤';

const LOCAL_CHIPS_PREFIX = 'poker_chip_memory_';
const LOCAL_AVATAR_PREFIX = 'poker_avatar_memory_';
const CHAT_OPEN_KEY = 'poker_chat_open';

const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const loginError = document.getElementById('login-error');
const localChipMemoryLogin = document.getElementById('local-chip-memory-login');
const localChipMemoryGame = document.getElementById('local-chip-memory-game');
const avatarEmojiSelect = document.getElementById('avatar-emoji-select');
const avatarUpload = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('avatar-preview');

const gamePhaseEl = document.getElementById('game-phase');
const potAmountEl = document.getElementById('pot-amount');
const communityCardsEl = document.getElementById('community-cards');
const seatsContainer = document.getElementById('seats-container');
const dealerButton = document.getElementById('dealer-button');

const myCardsEl = document.getElementById('my-cards');
const actionButtons = document.getElementById('action-buttons');
const betControls = document.getElementById('bet-controls');
const betSlider = document.getElementById('bet-slider');
const betInput = document.getElementById('bet-input');
const rebuyBtn = document.getElementById('rebuy-btn');

const chatToggle = document.getElementById('chat-toggle');
const chatArea = document.getElementById('chat-area');
const chatDockBtn = document.getElementById('chat-dock-btn');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const chatMessages = document.getElementById('chat-messages');
const notifications = document.getElementById('notifications');
const winnerModal = document.getElementById('winner-modal');
const closeModalBtn = document.getElementById('close-modal');

// ============ AUTO-START ============
window.addEventListener('load', () => {
    // Check for name in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlName = urlParams.get('name');
    
    if (urlName) {
        usernameInput.value = urlName;
        joinGame();
    } else {
        // Just pre-fill a random name but don't auto-join
        const randomId = Math.floor(Math.random() * 9000) + 1000;
        usernameInput.value = `Player${randomId}`;
        usernameInput.focus();
        usernameInput.select();
    }

    refreshLocalMemoryUI();
    applyChatVisibility(getSavedChatOpenState());
});

avatarEmojiSelect?.addEventListener('change', () => {
    const name = usernameInput.value.trim();
    selectedAvatar = avatarEmojiSelect.value || '👤';
    if (name.length >= 2) {
        saveAvatarForName(name, selectedAvatar);
    }
    renderAvatarPreview(selectedAvatar);
    syncAvatarControls(selectedAvatar);
});

avatarUpload?.addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const dataUrl = await fileToDataURL(file);
    selectedAvatar = dataUrl;
    const name = usernameInput.value.trim();
    if (name.length >= 2) {
        saveAvatarForName(name, selectedAvatar);
    }
    renderAvatarPreview(selectedAvatar);
    syncAvatarControls(selectedAvatar);
});

usernameInput?.addEventListener('input', () => {
    refreshLocalMemoryUI();
});

// ============ SOCKET HANDLERS ============

socket.on('connect', () => {
    socketConnected = true;
    loginError.textContent = '';
});

socket.on('connect_error', () => {
    socketConnected = false;
    loginError.textContent = 'Unable to reach poker server. This page needs a live backend. Please try again in a moment.';
});

socket.on('disconnect', () => {
    socketConnected = false;
});

socket.on('join_success', (data) => {
    mySeat = data.player.seat;
    myName = data.player.name;
    loginScreen.classList.remove('active');
    gameScreen.classList.add('active');
    updateUI(data.gameState);
    addChatMessage('Dealer', `Welcome to the table, ${myName}!`, 'dealer');

    refreshLocalMemoryUI();
});

socket.on('join_error', (error) => {
    loginError.textContent = error;
    loginScreen.classList.add('active');
    gameScreen.classList.remove('active');
});

socket.on('game_state', (state) => {
    const oldPhase = gameState ? gameState.phase : 'waiting';
    const newPhase = state.phase;
    
    // Animate chip movements if pot increased
    if (gameState && state.pot > gameState.pot) {
        const diff = state.pot - gameState.pot;
        // Animate from active players to pot
        state.players.forEach(p => {
            if (p.currentBet > 0) {
                const seatEl = document.querySelector(`.seat[data-seat="${p.seat}"]`);
                if (seatEl) {
                    animationManager.animatePotGain(seatEl, potAmountEl, diff);
                }
            }
        });
    }

    updateUI(state);
    updateRebuyVisibility();

    // Deal animations
    if (oldPhase === 'waiting' && newPhase === 'preflop') {
        const playerSeats = state.players.filter(p => p.isActive).map(p => p.seat);
        const playerEls = playerSeats.map(s => document.querySelector(`.seat[data-seat="${s}"]`)).filter(el => el);
        animationManager.dealCards(dealerButton, playerEls, soundManager);
    }
});

socket.on('private_state', (state) => {
    updatePrivateState(state);
});

socket.on('player_action', (data) => {
    soundManager.playSound(data.action);
    const seatEl = document.querySelector(`.seat[data-seat="${data.seat}"]`);
    if (seatEl) {
        if (data.action === 'fold') {
            animationManager.animateFold(seatEl);
        } else {
            animationManager.animatePlayerAction(seatEl, data.action);
        }
        
        // Chip animation for bets/raises
        if (data.amount > 0) {
            animationManager.animatePotGain(seatEl, potAmountEl, data.amount);
        }
    }
});

socket.on('chat_message', (data) => {
    const player = gameState?.players.find(p => p.seat === data.seat);
    const senderName = player ? player.name : `Seat ${data.seat}`;
    addChatMessage(senderName, data.message);
    if (chatEnabled) {
        showChatBubble(data.seat, data.message);
    }
});

socket.on('emoji_reaction', (data) => {
    if (chatEnabled) {
        showChatBubble(data.seat, data.emoji);
    }
});

socket.on('system_msg', (msg) => {
    addChatMessage('Dealer', msg, 'dealer');
});

socket.on('showdown', (data) => {
    showWinner(data);
});

socket.on('win_by_default', (data) => {
    showWinByDefault(data);
});

socket.on('action_error', (error) => {
    showNotification(error, 'error');
});

// ============ UI FUNCTIONS ============

function addChatMessage(name, message, type = '') {
    if (!chatMessages) return;
    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${type}`;
    msgEl.innerHTML = `<span class="name">${name}:</span> <span class="text">${message}</span>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function joinGame() {
    const name = usernameInput.value.trim();
    if (name.length < 2) {
        loginError.textContent = 'Name must be at least 2 characters';
        return;
    }

    if (!socketConnected) {
        loginError.textContent = 'Poker server is not connected. If this is GitHub Pages, set window.POKER_SERVER_URL to your deployed backend URL.';
        return;
    }

    const savedAvatar = getAvatarForName(name);
    if (savedAvatar) {
        selectedAvatar = savedAvatar;
    } else {
        saveAvatarForName(name, selectedAvatar || '👤');
    }

    renderAvatarPreview(selectedAvatar);
    syncAvatarControls(selectedAvatar);

    socket.emit('join_game', {
        username: name,
        avatar: selectedAvatar || '👤'
    });
}

joinBtn.addEventListener('click', joinGame);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinGame();
});

function updateUI(state) {
    gameState = state;
    gamePhaseEl.textContent = state.phase.toUpperCase();
    potAmountEl.textContent = state.pot;
    renderCommunityCards(state.communityCards);
    renderSeats(state.players, state.currentPlayerSeat, state.dealerSeat);

    if (myName) {
        const me = state.players.find((p) => p.name === myName && p.seat === mySeat);
        if (me && me.avatar) {
            selectedAvatar = me.avatar;
            saveAvatarForName(myName, selectedAvatar);
            renderAvatarPreview(selectedAvatar);
            syncAvatarControls(selectedAvatar);
        }
    }
}

function updatePrivateState(state) {
    privateState = state;
    renderMyCards(state.myCards);
    updateActionButtons(state.availableActions, state.toCall);

    if (myName) {
        saveLocalChips(myName, state.myStack);
        refreshLocalMemoryUI();
    }

    updateRebuyVisibility();
}

function renderSeats(players, currentPlayerSeat, dealerSeat) {
    seatsContainer.innerHTML = '';

    // Max 7 players as per server.js
    for (let i = 0; i < 7; i++) {
        const player = players.find(p => p.seat === i);
        const seatEl = document.createElement('div');
        seatEl.className = 'seat';
        seatEl.setAttribute('data-seat', i);

        if (!player) {
            seatEl.classList.add('empty');
            seatEl.innerHTML = `
                <div class="avatar">👤</div>
                <div class="player-info">
                    <div class="player-name">Empty</div>
                </div>
            `;
        } else {
            if (player.folded) seatEl.classList.add('folded');
            if (player.seat === currentPlayerSeat) seatEl.classList.add('current-turn');
            if (player.allIn) seatEl.classList.add('all-in');

            let cardsHTML = '';
            if (player.hasCards) {
                if (player.seat === mySeat) {
                    cardsHTML = `
                        <div class="player-cards">
                            <div class="card mini"></div>
                            <div class="card mini"></div>
                        </div>
                    `;
                } else {
                    cardsHTML = `
                        <div class="player-cards">
                            <div class="card back mini"></div>
                            <div class="card back mini"></div>
                        </div>
                    `;
                }
            }

            let betHTML = '';
            if (player.currentBet > 0) {
                betHTML = `<div class="player-bet">${player.currentBet}</div>`;
            }

            let actionHTML = '';
            if (player.lastAction) {
                actionHTML = `<div class="player-action-label">${player.lastAction}</div>`;
            }

            const avatarMarkup = getAvatarMarkup(player, player.seat === mySeat, player.allIn, actionHTML);
            seatEl.innerHTML = `
                <div class="chat-bubble" id="bubble-${player.seat}"></div>
                ${cardsHTML}
                ${avatarMarkup}
                ${betHTML}
                <div class="player-info">
                    <div class="player-name">${player.name}${player.seat === mySeat ? ' (You)' : ''}</div>
                    <div class="player-stack">${player.stack}</div>
                </div>
            `;
        }

        seatsContainer.appendChild(seatEl);
    }

    if (dealerSeat !== undefined) {
        positionDealerButton(dealerSeat);
        dealerButton.style.display = 'flex';
    } else {
        dealerButton.style.display = 'none';
    }
}

function positionDealerButton(seat) {
    const seatEl = document.querySelector(`.seat[data-seat="${seat}"]`);
    if (seatEl) {
        const rect = seatEl.getBoundingClientRect();
        const containerRect = seatsContainer.getBoundingClientRect();
        
        dealerButton.style.top = `${rect.top - containerRect.top + 10}px`;
        dealerButton.style.left = `${rect.left - containerRect.left + 10}px`;
        animationManager.animateDealerButton(dealerButton);
    }
}

function renderCommunityCards(cards) {
    communityCardsEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const cardEl = document.createElement('div');
        if (cards && cards[i]) {
            const c = cards[i];
            cardEl.className = `card ${c.color}`;
            cardEl.innerHTML = `
                <span class="value">${c.value}</span>
                <span class="suit-symbol">${getSuitSymbol(c.suit)}</span>
            `;
        } else {
            cardEl.className = 'card placeholder';
        }
        communityCardsEl.appendChild(cardEl);
    }
}

function renderMyCards(cards) {
    myCardsEl.innerHTML = '';
    if (!cards || cards.length === 0) return;

    cards.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${c.color}`;
        cardEl.innerHTML = `
            <span class="value">${c.value}</span>
            <span class="suit-symbol">${getSuitSymbol(c.suit)}</span>
        `;
        myCardsEl.appendChild(cardEl);
    });
}

function getSuitSymbol(suit) {
    const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    return symbols[suit] || suit;
}

function updateActionButtons(actions, toCall) {
    const btns = actionButtons.querySelectorAll('.action-btn');
    btns.forEach(btn => {
        const action = btn.dataset.action;
        const available = actions && actions.includes(action);
        btn.disabled = !available;

        if (action === 'call') {
            btn.querySelector('.call-amount').textContent = toCall > 0 ? toCall : '';
        }
    });

    if (!actions || (!actions.includes('bet') && !actions.includes('raise'))) {
        betControls.style.display = 'none';
    }
}

actionButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn || btn.disabled) return;

    const action = btn.dataset.action;
    if (action === 'bet' || action === 'raise') {
        pendingBetAction = action;
        showBetControls(action);
    } else {
        socket.emit('player_action', { action: action });
    }
});

function showBetControls(action) {
    betControls.style.display = 'block';
    
    const myPlayer = gameState.players.find(p => p.seat === mySeat);
    const minRaise = gameState.minRaise;
    const currentBet = gameState.currentBet;
    
    let min, max;
    if (action === 'bet') {
        min = minRaise;
        max = myPlayer.stack;
    } else {
        min = currentBet + minRaise;
        max = myPlayer.stack + myPlayer.currentBet;
    }

    betSlider.min = min;
    betSlider.max = max;
    betSlider.value = min;
    betInput.value = min;
    betInput.min = min;
    betInput.max = max;
}

betSlider.addEventListener('input', () => {
    betInput.value = betSlider.value;
});

betInput.addEventListener('input', () => {
    const val = parseInt(betInput.value) || 0;
    betSlider.value = val;
});

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        let val;
        const myPlayer = gameState.players.find(p => p.seat === mySeat);
        const max = myPlayer.stack + myPlayer.currentBet;
        
        switch (btn.dataset.preset) {
            case 'min': val = parseInt(betSlider.min); break;
            case 'half': val = Math.floor(gameState.pot / 2); break;
            case 'pot': val = gameState.pot; break;
            case 'allin': val = max; break;
        }
        val = Math.max(parseInt(betSlider.min), Math.min(val, max));
        betSlider.value = val;
        betInput.value = val;
    });
});

document.getElementById('confirm-bet').addEventListener('click', () => {
    const amount = parseInt(betInput.value);
    socket.emit('player_action', { action: pendingBetAction, amount: amount });
    betControls.style.display = 'none';
});

document.getElementById('cancel-bet').addEventListener('click', () => {
    betControls.style.display = 'none';
});

rebuyBtn.addEventListener('click', () => {
    socket.emit('request_rebuy');
});

// ============ CHAT & EMOJI ============

sendBtn.addEventListener('click', sendChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
});

chatCloseBtn?.addEventListener('click', () => {
    applyChatVisibility(false);
});

chatDockBtn?.addEventListener('click', () => {
    applyChatVisibility(true);
});

function sendChat() {
    const msg = chatInput.value.trim();
    if (msg) {
        socket.emit('send_chat', msg);
        chatInput.value = '';
    }
}

emojiBtn.addEventListener('click', () => {
    emojiPicker.classList.toggle('show');
});

emojiPicker.querySelectorAll('span').forEach(el => {
    el.addEventListener('click', () => {
        const emoji = el.dataset.emoji;
        socket.emit('send_emoji', emoji);
        emojiPicker.classList.remove('show');
    });
});

function showChatBubble(seat, message) {
    const bubbleContainer = document.getElementById(`bubble-${seat}`);
    if (!bubbleContainer) return;

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'bubble-text';
    bubbleEl.textContent = message;
    bubbleContainer.appendChild(bubbleEl);

    setTimeout(() => {
        bubbleEl.remove();
    }, 3000);
}

// ============ MODALS & NOTIFICATIONS ============

function showWinner(data) {
    // Instead of modal, show in chat
    data.winners.forEach(w => {
        addChatMessage('Dealer', `🏆 ${w.name} wins ${w.winAmount} chips with ${w.handName}!`, 'dealer');
    });
    
    // Also show notification
    const winnerNames = data.winners.map(w => w.name).join(', ');
    showNotification(`Hand over! Winners: ${winnerNames}`, 'success');
}

function showWinByDefault(data) {
    // Instead of modal, show in chat
    addChatMessage('Dealer', `🏆 ${data.winner.name} wins ${data.winner.amount} chips because everyone else folded.`, 'dealer');
    showNotification(`${data.winner.name} wins the pot!`, 'success');
}

closeModalBtn.addEventListener('click', () => {
    winnerModal.style.display = 'none';
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Settings
chatToggle.addEventListener('change', () => {
    chatEnabled = chatToggle.checked;
    // If user toggles chat off, hide chat panel but keep dock visible.
    if (!chatEnabled) {
        applyChatVisibility(false, true);
    } else {
        applyChatVisibility(getSavedChatOpenState());
    }
});

const soundToggle = document.getElementById('sound-toggle');
const soundLabel = document.getElementById('sound-label');

soundToggle.addEventListener('change', () => {
    soundEnabled = soundToggle.checked;
    soundManager.enabled = soundEnabled;
    soundLabel.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
});

function keyForChips(name) {
    return `${LOCAL_CHIPS_PREFIX}${String(name || '').trim().toLowerCase()}`;
}

function keyForAvatar(name) {
    return `${LOCAL_AVATAR_PREFIX}${String(name || '').trim().toLowerCase()}`;
}

function saveLocalChips(name, chips) {
    if (!name) return;
    const payload = {
        chips: Number.isFinite(chips) ? chips : 0,
        updatedAt: Date.now()
    };
    localStorage.setItem(keyForChips(name), JSON.stringify(payload));
}

function getLocalChips(name) {
    if (!name) return null;
    try {
        const raw = localStorage.getItem(keyForChips(name));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveAvatarForName(name, avatar) {
    if (!name || !avatar) return;
    localStorage.setItem(keyForAvatar(name), avatar);
}

function getAvatarForName(name) {
    if (!name) return null;
    return localStorage.getItem(keyForAvatar(name));
}

function renderAvatarPreview(avatarValue) {
    if (!avatarPreview) return;
    const value = avatarValue || '👤';
    if (value.startsWith('data:image/')) {
        avatarPreview.innerHTML = `<img src="${value}" alt="avatar preview">`;
    } else {
        avatarPreview.textContent = value;
    }
}

function refreshLocalMemoryUI() {
    const name = (myName || usernameInput.value || '').trim();
    const memory = getLocalChips(name);

    if (localChipMemoryLogin) {
        localChipMemoryLogin.textContent = memory
            ? `Local chip memory: ${memory.chips} chips`
            : 'Local chip memory: —';
    }

    if (localChipMemoryGame) {
        localChipMemoryGame.textContent = memory
            ? `Local chips: ${memory.chips}`
            : 'Local chips: —';
    }

    const savedAvatar = getAvatarForName(name);
    if (savedAvatar) {
        selectedAvatar = savedAvatar;
        renderAvatarPreview(savedAvatar);
        syncAvatarControls(savedAvatar);
    } else {
        renderAvatarPreview(selectedAvatar || '👤');
        syncAvatarControls(selectedAvatar || '👤');
    }
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function getAvatarMarkup(player, isMe, isAllIn, actionHTML) {
    const fallback = isAllIn ? '🔥' : (isMe ? '⭐' : '👤');
    const avatarValue = normalizeAvatar(player.avatar) || fallback;

    if (typeof avatarValue === 'string' && avatarValue.startsWith('data:image/')) {
        return `
            <div class="avatar">
                <img class="avatar-img" src="${avatarValue}" alt="${player.name} avatar" />
                ${actionHTML}
            </div>
        `;
    }

    const symbol = avatarValue || fallback;
    return `
        <div class="avatar">
            ${symbol}
            ${actionHTML}
        </div>
    `;
}

function normalizeAvatar(value) {
    if (!value) return '';
    const str = String(value).trim();

    if (str.startsWith('data:image/')) return str;

    // If avatar accidentally arrives as object payload text
    if (str === '[object Object]') return '👤';

    // Keep emoji/symbols
    return str;
}

function syncAvatarControls(avatarValue) {
    const value = normalizeAvatar(avatarValue) || '👤';
    if (!avatarEmojiSelect) return;

    // For uploaded images, keep select at Default
    if (value.startsWith('data:image/')) {
        avatarEmojiSelect.value = '👤';
        return;
    }

    const optionExists = Array.from(avatarEmojiSelect.options).some((opt) => opt.value === value);
    avatarEmojiSelect.value = optionExists ? value : '👤';
}

function getSavedChatOpenState() {
    try {
        const raw = localStorage.getItem(CHAT_OPEN_KEY);
        if (raw === null) return true;
        return raw === '1';
    } catch {
        return true;
    }
}

function setSavedChatOpenState(isOpen) {
    try {
        localStorage.setItem(CHAT_OPEN_KEY, isOpen ? '1' : '0');
    } catch {
        // ignore storage errors
    }
}

function applyChatVisibility(isOpen, skipPersist = false) {
    if (!chatArea || !chatDockBtn) return;

    const shouldShow = !!isOpen && !!chatEnabled;
    chatArea.classList.toggle('hidden', !shouldShow);
    chatDockBtn.style.display = shouldShow ? 'none' : 'inline-flex';

    if (!skipPersist) {
        setSavedChatOpenState(!!isOpen);
    }
}

function updateRebuyVisibility() {
    if (!rebuyBtn) return;

    // Must be the local player's private state and only while table is waiting.
    const myStack = Number(privateState?.myStack);
    const isWaiting = gameState?.phase === 'waiting';

    // Defensive: verify local player seat exists in public state and matches local identity.
    const localPublicPlayer = (gameState?.players || []).find((p) => p.seat === mySeat);
    const isLocalSeatValid = !!localPublicPlayer && String(localPublicPlayer.name || '').trim() === String(myName || '').trim();

    const shouldShow = isLocalSeatValid && isWaiting && myStack === 0;
    rebuyBtn.style.display = shouldShow ? 'block' : 'none';
}
