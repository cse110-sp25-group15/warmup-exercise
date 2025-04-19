// Game state variables
let gameState = 'notStarted';
let playerContainer = null;
let dealerContainer = null;
let playerScoreDisplay = null;
let dealerScoreDisplay = null;
let messageDisplay = null;

function removeCard(cardElement) {
  if (!cardElement) return false;
  cardElement.remove();
  return true;
}

function clearAllCards() {
  const playerCards = document.querySelectorAll('#player-cards playing-card');
  const dealerCards = document.querySelectorAll('#dealer-cards playing-card');
  const count = playerCards.length + dealerCards.length;

  playerCards.forEach(card => card.remove());
  dealerCards.forEach(card => card.remove());
  
  return count;
}

function getCardValue(cardId) {
  if (!cardId || cardId.length < 2) return null;
  
  if (cardId.startsWith('back_')) return 0;

  const value = cardId.substring(1);

  if (value === 'A') {
    return 11;
  } else if (value === 'K' || value === 'Q' || value === 'J') {
    return 10;
  } else {
    return parseInt(value);
  }
}

function flipCard(cardElement) {
  if (!cardElement) return false;

  const isFlipped = cardElement.hasAttribute('flipped');
  
  if (isFlipped) {
    cardElement.removeAttribute('flipped');
  } else {
    cardElement.setAttribute('flipped', '');
  }
  
  if (cardElement.parentElement === playerContainer) {
    updatePlayerScore();
  }
  
  return true;
}

function getVisibleCards(cards) {
  return Array.from(cards).filter(card => !card.hasAttribute('flipped'));
}

function calculateHandScore(cards) {
  if (!cards || cards.length === 0) return 0;

  let score = 0;
  let aceCount = 0;

  for (const card of cards) {
    const cardId = card.getAttribute('card-id');
    const value = getCardValue(cardId);

    if (value === 11) aceCount++;
    score += value;
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
}

function updatePlayerScore() {
  if (!playerContainer || !playerScoreDisplay) return;
  
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const visiblePlayerCards = getVisibleCards(playerCards);
  const playerScore = calculateHandScore(visiblePlayerCards);
  
  updateScoreDisplay(playerScoreDisplay, playerScore);
  
  if (gameState === 'playerTurn' && playerScore > 21) {
    updateMessage("Bust! Dealer wins.");
    setGameState('gameOver');
  }
  
  return playerScore;
}

function updateScoreDisplay(displayElement, score) {
  if (!displayElement) return false;

  displayElement.textContent = score;
  return true;
}

function isBust(cards) {
  const score = calculateHandScore(cards);
  return score > 21;
}

function isBlackjack(cards) {
  if (cards.length !== 2) return false;

  const originalFlippedState = Array.from(cards).map(card => card.hasAttribute('flipped'));
  
  cards.forEach(card => {
    if (!card.hasAttribute('flipped')) {
      card.setAttribute('flipped', '');
    }
  });
  
  const score = calculateHandScore(cards);  
  cards.forEach((card, index) => {
    if (!originalFlippedState[index]) {
      card.removeAttribute('flipped');
    }
  });
  
  return score === 21;
}

function initializeGame(playerArea, dealerArea, playerScore, dealerScore, messageArea) {
  playerContainer = playerArea;
  dealerContainer = dealerArea;
  playerScoreDisplay = playerScore;
  dealerScoreDisplay = dealerScore;
  messageDisplay = messageArea;

  clearAllCards();
  updateScoreDisplay(playerScoreDisplay, 0);
  updateScoreDisplay(dealerScoreDisplay, 0);
  updateMessage('Welcome to Blackjack! Press "DEAL" to start.');

  setGameState('notStarted');

  setupPlayerCardFlipping();
}

function setupPlayerCardFlipping() {
  playerContainer.addEventListener('flipped', () => {
    if (gameState === 'playerTurn') {
      updatePlayerScore();
    }
  });
}

function updateMessage(message) {
  if (messageDisplay) {
    messageDisplay.textContent = message;
  }
}

function setGameState(state) {
  gameState = state;

  const hitButton = document.querySelector('custom-button[hit]');
  const stayButton = document.querySelector('custom-button[stay]');
  const dealButton = document.querySelector('custom-button[deal]');

  if (state === 'notStarted' || state === 'gameOver') {
    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');
    dealButton.removeAttribute('disabled');
  } else if (state === 'playerTurn') {
    hitButton.removeAttribute('disabled');
    stayButton.removeAttribute('disabled');
    dealButton.setAttribute('disabled', '');
  } else if (state === 'dealerTurn') {
    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');
    dealButton.setAttribute('disabled', '');
  }

  return gameState;
}

function handlePlayerHit() {
  if (gameState !== 'playerTurn') return false;
  dealRandomCardToWithAnimation(playerContainer, true);
  return true;
}

function handlePlayerStay() {
  if (gameState !== 'playerTurn') return false;

  revealPlayerCards();
  setGameState('dealerTurn');
  updateMessage("Dealer's turn");
  revealDealerCards();
  executeDealerTurn();

  return true;
}

function revealPlayerCards() {
  const playerCards = playerContainer.querySelectorAll('playing-card');
  let flippedCount = 0;
  
  for (const card of playerCards) {
    if (card.hasAttribute('flipped')) {
      flipCard(card);
      flippedCount++;
    }
  }
  
  updatePlayerScore();
  return flippedCount;
}

function revealDealerCards() {
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  let flippedCount = 0;
  
  for (const card of dealerCards) {
    if (card.hasAttribute('flipped')) {
      flipCard(card);
      flippedCount++;
    }
  }

  const dealerScore = calculateHandScore(dealerContainer.querySelectorAll('playing-card'));
  updateScoreDisplay(dealerScoreDisplay, dealerScore);

  return dealerScore;
}

function executeDealerTurn() {
  if (gameState !== 'dealerTurn') return false;

  const dealerNextMove = () => {
    const dealerScore = calculateHandScore(dealerContainer.querySelectorAll('playing-card'));

    if (dealerScore < 17) {
      updateMessage("Dealer hits");
      dealRandomCardToWithAnimation(dealerContainer);

      const newScore = calculateHandScore(dealerContainer.querySelectorAll('playing-card'));
      updateScoreDisplay(dealerScoreDisplay, newScore);

      if (newScore > 21) {
        updateMessage("Dealer busts! You win!");
        setGameState('gameOver');
      } else {
        setTimeout(dealerNextMove, 1000);
      }
    } else {
      determineWinner();
    }
  };

  setTimeout(dealerNextMove, 1000);
  return true;
}

function determineWinner() {
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  
  revealPlayerCards();

  const playerScore = calculateHandScore(playerCards);
  const dealerScore = calculateHandScore(dealerCards);

  updateScoreDisplay(playerScoreDisplay, playerScore);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);

  if (playerScore > 21) {
    updateMessage("Bust! Dealer wins.");
  } else if (dealerScore > 21) {
    updateMessage("Dealer busts! You win!");
  } else if (playerScore > dealerScore) {
    updateMessage("You win!");
  } else if (dealerScore > playerScore) {
    updateMessage("Dealer wins.");
  } else {
    updateMessage("Push - it's a tie!");
  }

  setGameState('gameOver');

  return {
    playerScore,
    dealerScore,
    winner: playerScore > dealerScore ? 'player' :
      dealerScore > playerScore ? 'dealer' : 'push'
  };
}

async function startNewRound() {
  updateScoreDisplay(playerScoreDisplay, 0);
  updateScoreDisplay(dealerScoreDisplay, 0);
  setGameState('dealerTurn');

  await dealInitialCardsWithAnimation(playerContainer, dealerContainer);

  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  const visibleDealerCards = getVisibleCards(dealerCards);
  
  const dealerScore = calculateHandScore(visibleDealerCards);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);

  updateMessage("Your turn - Click cards to flip them, then Hit or Stay");
  setGameState('playerTurn');

  return gameState;
}

function setupGameEventListeners() {
  document.addEventListener('hit', () => {
    handlePlayerHit();
  });

  document.addEventListener('stay', () => {
    handlePlayerStay();
  });

  document.addEventListener('deal', () => {
    startNewRound();
  });
}

function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}

function createAnimatedCard(cardId, sourcePosition, targetPosition, onComplete) {
  const animatedCard = document.createElement('playing-card');
  animatedCard.setAttribute('card-id', cardId);
  animatedCard.classList.add('animated-card');
  
  animatedCard.setAttribute('flipped', '');
  
  animatedCard.style.position = 'absolute';
  animatedCard.style.left = `${sourcePosition.x}px`;
  animatedCard.style.top = `${sourcePosition.y}px`;
  animatedCard.style.zIndex = '1000';
  animatedCard.style.transition = 'all 0.5s ease-out';

  document.body.appendChild(animatedCard);

  void animatedCard.offsetWidth;

  animatedCard.style.left = `${targetPosition.x}px`;
  animatedCard.style.top = `${targetPosition.y}px`;

  let callbackExecuted = false;

  animatedCard.addEventListener('transitionend', () => {
    if (callbackExecuted) return;
    callbackExecuted = true;

    animatedCard.remove();
    if (onComplete) onComplete();
  });

  return animatedCard;
}

function addCardToContainerWithAnimation(container, cardId, faceDown = false) {
  if (!container) return null;

  const deck = document.querySelector('#main-deck');
  const sourcePosition = getElementPosition(deck);

  const containerRect = container.getBoundingClientRect();
  const existingCards = container.querySelectorAll('playing-card').length;
  const cardWidth = 150; 
  const margin = 10;
  const cardSpacing = cardWidth + margin * 2;
  const initialX = containerRect.left + 6.66
  const targetPosition = {
    x: initialX + (existingCards * cardSpacing) + margin,
    y: containerRect.top + (containerRect.height / 2) - 218/2
  };

  let animationCompleted = false;

  createAnimatedCard(cardId, sourcePosition, targetPosition, () => {
    if (animationCompleted) return;
    animationCompleted = true;

    const newCard = document.createElement('playing-card');
    newCard.setAttribute('card-id', cardId);
    
    if (faceDown) {
      newCard.setAttribute('flipped', '');
    }
    
    container.appendChild(newCard);

    if (container === dealerContainer && !faceDown) {
      updateScoreDisplay(dealerScoreDisplay, calculateHandScore(getVisibleCards(dealerContainer.querySelectorAll('playing-card'))));
    }
  });

  return new Promise(resolve => {
    setTimeout(() => {
      if (!animationCompleted) {
        animationCompleted = true;
      }
      resolve(container.lastElementChild);
    }, 600);
  });
}

function dealRandomCardToWithAnimation(container, faceDown = false) {
  const suits = ['H', 'D', 'C', 'S'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomValue = values[Math.floor(Math.random() * values.length)];
  const cardId = `${randomSuit}${randomValue}`;

  return addCardToContainerWithAnimation(container, cardId, faceDown);
}

async function dealInitialCardsWithAnimation(playerContainer, dealerContainer) {
  clearAllCards();

  try {
    const playerCard1 = await dealRandomCardToWithAnimation(playerContainer, true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const playerCard2 = await dealRandomCardToWithAnimation(playerContainer, true);

    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = await dealRandomCardToWithAnimation(dealerContainer, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = await dealRandomCardToWithAnimation(dealerContainer, true);

    updateMessage("Your turn - Click cards to flip them, then Hit or Stay");

    return {
      player: [playerCard1, playerCard2],
      dealer: [dealerCard1, dealerCard2]
    };
  } catch (error) {
    return {
      player: [],
      dealer: []
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const playerArea = document.querySelector('#player-cards');
  const dealerArea = document.querySelector('#dealer-cards');
  const playerScore = document.querySelector('#player-score');
  const dealerScore = document.querySelector('#dealer-score');
  const messageArea = document.querySelector('#message');
  
  if (playerArea && dealerArea && playerScore && dealerScore && messageArea) {
    initializeGame(playerArea, dealerArea, playerScore, dealerScore, messageArea);
    setupGameEventListeners();
  }
  
  const originalSetGameState = setGameState;
  setGameState = function(state) {
    document.body.setAttribute('data-game-state', state);
    return originalSetGameState(state);
  };
});