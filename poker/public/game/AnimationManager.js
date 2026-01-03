class AnimationManager {
    constructor() {
        this.dealingCards = [];
        this.activeAnimations = [];
    }

    animateDealCard(fromElement, toElement, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!fromElement || !toElement) {
                    resolve();
                    return;
                }

                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();

                const card = document.createElement('div');
                card.className = 'card animated-card';
                card.style.position = 'fixed';
                card.style.left = fromRect.left + 'px';
                card.style.top = fromRect.top + 'px';
                card.style.width = fromRect.width + 'px';
                card.style.height = fromRect.height + 'px';
                card.style.pointerEvents = 'none';
                card.style.zIndex = '9999';
                card.innerHTML = `<div class="card-back"></div>`;

                document.body.appendChild(card);

                requestAnimationFrame(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    card.style.left = toRect.left + 'px';
                    card.style.top = toRect.top + 'px';
                    card.style.width = toRect.width + 'px';
                    card.style.height = toRect.height + 'px';
                    card.style.opacity = '0.95';

                    setTimeout(() => {
                        card.remove();
                        resolve();
                    }, 500);
                });
            }, delay);
        });
    }

    animateCardFlip(cardElement) {
        return new Promise((resolve) => {
            cardElement.style.transition = 'transform 0.3s ease-in-out';
            cardElement.style.transform = 'rotateY(180deg)';

            setTimeout(() => {
                cardElement.style.transform = 'rotateY(0deg)';
                resolve();
            }, 300);
        });
    }

    animatePotGain(fromElement, toElement, amount) {
        return new Promise((resolve) => {
            const fromRect = fromElement.getBoundingClientRect();
            const toRect = toElement.getBoundingClientRect();

            const chip = document.createElement('div');
            chip.className = 'animated-chip';
            chip.style.position = 'fixed';
            chip.style.left = fromRect.left + 'px';
            chip.style.top = fromRect.top + 'px';
            chip.style.pointerEvents = 'none';
            chip.style.zIndex = '9998';
            chip.innerHTML = '💰';
            chip.style.fontSize = '20px';

            document.body.appendChild(chip);

            requestAnimationFrame(() => {
                chip.style.transition = 'all 0.6s ease-in';
                chip.style.left = toRect.left + 'px';
                chip.style.top = toRect.top + 'px';
                chip.style.opacity = '0.3';
                chip.style.transform = 'scale(0.5)';

                setTimeout(() => {
                    chip.remove();
                    resolve();
                }, 600);
            });
        });
    }

    animateBet(betElement) {
        return new Promise((resolve) => {
            betElement.style.animation = 'popIn 0.3s ease-out';
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }

    animateFold(playerElement) {
        return new Promise((resolve) => {
            playerElement.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => {
                resolve();
            }, 400);
        });
    }

    animatePlayerAction(playerElement, action) {
        return new Promise((resolve) => {
            const label = document.createElement('div');
            label.className = 'action-label';
            label.textContent = action;
            label.style.position = 'absolute';
            label.style.animation = 'floatUp 1s ease-out forwards';

            playerElement.style.position = 'relative';
            playerElement.appendChild(label);

            setTimeout(() => {
                label.remove();
                resolve();
            }, 1000);
        });
    }

    animateDealerButton(dealerButton) {
        return new Promise((resolve) => {
            dealerButton.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                resolve();
            }, 600);
        });
    }

    async dealCards(deckElement, playerElements, soundManager) {
        const deals = [];

        for (let i = 0; i < 2; i++) {
            for (const playerElement of playerElements) {
                const delay = (i * playerElements.length + playerElements.indexOf(playerElement)) * 150;
                deals.push(
                    this.animateDealCard(deckElement, playerElement, delay).then(() => {
                        if (soundManager) soundManager.playSound('deal');
                    })
                );
            }
        }

        await Promise.all(deals);
    }

    highlightCurrentPlayer(playerElements) {
        playerElements.forEach((el, idx) => {
            if (el.classList.contains('current-turn')) {
                el.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
                el.style.animation = 'glow 1.5s ease-in-out infinite';
            } else {
                el.style.boxShadow = 'none';
                el.style.animation = 'none';
            }
        });
    }

    clearAnimations() {
        const animatedCards = document.querySelectorAll('.animated-card');
        const animatedChips = document.querySelectorAll('.animated-chip');
        animatedCards.forEach(el => el.remove());
        animatedChips.forEach(el => el.remove());
    }
}
