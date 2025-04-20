// Game state variables
let gameState = 'notStarted';
let playerContainer = null;
let dealerContainer = null;
let playerScoreDisplay = null;
let dealerScoreDisplay = null;
let messageDisplay = null;
let playerMoney = 1000;     // Default starting money
let currentBet = 0;         // Current bet amount
let playerMoneyDisplay = null;
let currentBetDisplay = null;

/**
 * Loads player money from local storage if available
 * @returns {number} - The loaded player money or default value
 */
function loadPlayerMoney() {
  const storedMoney = localStorage.getItem('blackjackPlayerMoney');
  if (storedMoney !== null) {
    return parseInt(storedMoney);
  }
  return 1000; // Default starting money
}

/**
 * Saves player money to local storage
 * @param {number} amount - The amount to save
 * @returns {boolean} - True if save was successful
 */
function savePlayerMoney(amount) {
  try {
    localStorage.setItem('blackjackPlayerMoney', amount.toString());
    console.log(`Player money saved to local storage: $${amount}`);
    return true;
  } catch (error) {
    console.error('Failed to save player money to local storage:', error);
    return false;
  }
}

/**
 * Removes a card element from the DOM
 * @param {HTMLElement} cardElement - The card element to remove
 * @returns {boolean} - True if the card was successfully removed
 */
function removeCard(cardElement) {
  if (!cardElement) return false;
  cardElement.remove();
  return true;
}

/**
 * Clears all cards from both player and dealer areas
 * @returns {number} - The total number of cards that were removed
 */
function clearAllCards() {
  const playerCards = document.querySelectorAll('#player-cards playing-card');
  const dealerCards = document.querySelectorAll('#dealer-cards playing-card');
  const count = playerCards.length + dealerCards.length;

  playerCards.forEach(card => card.remove());
  dealerCards.forEach(card => card.remove());
  
  return count;
}

/**
 * Extracts and calculates the numeric value of a card based on its ID
 * @param {string} cardId - The ID of the card (e.g., 'H10', 'SK', 'DA')
 * @returns {number|null} - The numeric value of the card or null if invalid
 */
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

/**
 * Toggles the flipped state of a card
 * @param {HTMLElement} cardElement - The card element to flip
 * @returns {boolean} - True if the card was successfully flipped
 */
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

/**
 * Filters a collection of cards to return only those that are face-up
 * @param {NodeList} cards - Collection of card elements
 * @returns {Array} - Array of visible (face-up) card elements
 */
function getVisibleCards(cards) {
  return Array.from(cards).filter(card => !card.hasAttribute('flipped'));
}

/**
 * Calculates the total score of a hand, accounting for Ace values
 * @param {NodeList|Array} cards - Collection of card elements
 * @returns {number} - The calculated hand score
 */
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

  // Adjust Ace values if needed to prevent busting
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
}

/**
 * Updates the player's score display based on current visible cards
 * @returns {number} - The updated player score
 */
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

/**
 * Updates a score display element with a new score value
 * @param {HTMLElement} displayElement - The element to update
 * @param {number} score - The score to display
 * @returns {boolean} - True if the display was successfully updated
 */
function updateScoreDisplay(displayElement, score) {
  if (!displayElement) return false;

  displayElement.textContent = score;
  return true;
}

/**
 * Checks if a hand of cards is bust (over 21)
 * @param {NodeList|Array} cards - Collection of card elements
 * @returns {boolean} - True if the hand is bust
 */
function isBust(cards) {
  const score = calculateHandScore(cards);
  return score > 21;
}

/**
 * Checks if a hand is a blackjack (21 with exactly 2 cards)
 * @param {NodeList|Array} cards - Collection of card elements
 * @returns {boolean} - True if the hand is a blackjack
 */
function isBlackjack(cards) {
  if (cards.length !== 2) return false;

  const originalFlippedState = Array.from(cards).map(card => card.hasAttribute('flipped'));
  
  // Temporarily flip all cards to calculate true score
  cards.forEach(card => {
    if (!card.hasAttribute('flipped')) {
      card.setAttribute('flipped', '');
    }
  });
  
  const score = calculateHandScore(cards);  
  
  // Restore original flip state
  cards.forEach((card, index) => {
    if (!originalFlippedState[index]) {
      card.removeAttribute('flipped');
    }
  });
  
  return score === 21;
}

/**
 * Updates the player's money display
 * @returns {number} - The current player money amount
 */
function updateMoneyDisplay() {
  if (playerMoneyDisplay) {
    playerMoneyDisplay.textContent = playerMoney;
  }
  
  // Save to local storage whenever money is updated
  savePlayerMoney(playerMoney);
  
  return playerMoney;
}

/**
 * Updates the current bet display
 * @returns {number} - The current bet amount
 */
function updateBetDisplay() {
  if (currentBetDisplay) {
    currentBetDisplay.textContent = currentBet;
  }
  return currentBet;
}

/**
 * Places a bet of the specified amount
 * @param {number} amount - The amount to bet
 * @returns {number|boolean} - The current bet amount or false if invalid
 */
function placeBet(amount) {
  if (amount > playerMoney) return false;
  
  currentBet += amount;
  playerMoney -= amount;
  
  updateMoneyDisplay();
  updateBetDisplay();
  
  // Enable deal button once a bet is placed
  const dealButton = document.querySelector('custom-button[deal]');
  if (dealButton && currentBet > 0) {
    dealButton.removeAttribute('disabled');
  }
  
  return currentBet;
}

/**
 * Clears the current bet and returns the money to the player
 * @returns {boolean} - True if the bet was successfully cleared
 */
function clearBet() {
  playerMoney += currentBet;
  currentBet = 0;
  
  updateMoneyDisplay();
  updateBetDisplay();
  
  // Disable deal button when no bet is placed
  const dealButton = document.querySelector('custom-button[deal]');
  if (dealButton) {
    dealButton.setAttribute('disabled', '');
  }
  
  return true;
}

/**
 * Places an all-in bet (bets all remaining money)
 * @returns {number|boolean} - The bet amount or false if player has no money
 */
function allInBet() {
  if (playerMoney <= 0) return false;
  
  return placeBet(playerMoney);
}

/**
 * Initializes the game with UI element references and resets the game state
 * @param {HTMLElement} playerArea - The player's card container
 * @param {HTMLElement} dealerArea - The dealer's card container
 * @param {HTMLElement} playerScore - The player's score display
 * @param {HTMLElement} dealerScore - The dealer's score display
 * @param {HTMLElement} messageArea - The message display area
 * @param {HTMLElement} moneyDisplay - The player's money display
 * @param {HTMLElement} betDisplay - The current bet display
 */
function initializeGame(playerArea, dealerArea, playerScore, dealerScore, messageArea, moneyDisplay, betDisplay) {
  playerContainer = playerArea;
  dealerContainer = dealerArea;
  playerScoreDisplay = playerScore;
  dealerScoreDisplay = dealerScore;
  messageDisplay = messageArea;
  playerMoneyDisplay = moneyDisplay;
  currentBetDisplay = betDisplay;

  // Load player money from local storage
  playerMoney = loadPlayerMoney();

  clearAllCards();
  updateScoreDisplay(playerScoreDisplay, 0);
  updateScoreDisplay(dealerScoreDisplay, 0);
  updateMoneyDisplay();
  updateBetDisplay();
  updateMessage('Welcome to Blackjack! Place your bet and press "DEAL" to start.');

  setGameState('notStarted');

  setupPlayerCardFlipping();
}

/**
 * Sets up event listeners for player card flipping
 */
function setupPlayerCardFlipping() {
  playerContainer.addEventListener('flipped', () => {
    if (gameState === 'playerTurn') {
      updatePlayerScore();
    }
  });
}

/**
 * Updates the message display with new text
 * @param {string} message - The message to display
 */
function updateMessage(message) {
  if (messageDisplay) {
    messageDisplay.textContent = message;
  }
}

/**
 * Sets the game state and updates UI accordingly
 * @param {string} state - The new game state
 * @returns {string} - The current game state
 */
function setGameState(state) {
  gameState = state;

  const hitButton = document.querySelector('custom-button[hit]');
  const stayButton = document.querySelector('custom-button[stay]');
  const dealButton = document.querySelector('custom-button[deal]');
  const betButtons = document.querySelectorAll('custom-button[bet-chip]');
  const clearBetButton = document.querySelector('custom-button[clear-bet]');
  const allInButton = document.querySelector('custom-button[bet-all-in]');

  if (state === 'notStarted' || state === 'gameOver') {
    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');
    
    // Only enable deal if there's a bet placed
    if (currentBet > 0) {
      dealButton.removeAttribute('disabled');
    } else {
      dealButton.setAttribute('disabled', '');
    }
    
    // Enable betting buttons based on player's money
    betButtons.forEach(btn => {
      const chipValue = parseInt(btn.getAttribute('bet-chip'));
      if (chipValue <= playerMoney) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', '');
      }
    });
    
    clearBetButton.removeAttribute('disabled');
    allInButton.removeAttribute('disabled');
  } else if (state === 'playerTurn') {
    hitButton.removeAttribute('disabled');
    stayButton.removeAttribute('disabled');
    dealButton.setAttribute('disabled', '');
    
    // Disable betting controls during player's turn
    betButtons.forEach(btn => btn.setAttribute('disabled', ''));
    clearBetButton.setAttribute('disabled', '');
    allInButton.setAttribute('disabled', '');
  } else if (state === 'dealerTurn') {
    hitButton.setAttribute('disabled', '');
    stayButton.setAttribute('disabled', '');
    dealButton.setAttribute('disabled', '');
    
    // Disable betting controls during dealer's turn
    betButtons.forEach(btn => btn.setAttribute('disabled', ''));
    clearBetButton.setAttribute('disabled', '');
    allInButton.setAttribute('disabled', '');
  }

  document.body.setAttribute('data-game-state', state);
  return gameState;
}

/**
 * Handles player hitting (requesting another card)
 * @returns {boolean} - True if hit was successful
 */
function handlePlayerHit() {
  if (gameState !== 'playerTurn') return false;
  dealRandomCardToWithAnimation(playerContainer, true);
  return true;
}

/**
 * Handles player staying (ending their turn)
 * @returns {boolean} - True if stay was successful
 */
function handlePlayerStay() {
  if (gameState !== 'playerTurn') return false;

  revealPlayerCards();
  setGameState('dealerTurn');
  updateMessage("Dealer's turn");
  revealDealerCards();
  executeDealerTurn();

  return true;
}

/**
 * Reveals all player cards that are face-down
 * @returns {number} - The number of cards that were flipped
 */
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

/**
 * Reveals all dealer cards that are face-down
 * @returns {number} - The updated dealer score
 */
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

/**
 * Executes the dealer's turn according to standard rules
 * @returns {boolean} - True if dealer turn was executed
 */
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

/**
 * Determines the winner of the round and processes payouts
 * @returns {Object} - Object containing scores and winner information
 */
function determineWinner() {
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  
  revealPlayerCards();

  const playerScore = calculateHandScore(playerCards);
  const dealerScore = calculateHandScore(dealerCards);
  const playerHasBlackjack = isBlackjack(playerCards);
  const dealerHasBlackjack = isBlackjack(dealerCards);

  updateScoreDisplay(playerScoreDisplay, playerScore);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);

  if (playerScore > 21) {
    updateMessage("Bust! Dealer wins.");
    playerLoses();
  } else if (dealerScore > 21) {
    updateMessage("Dealer busts! You win!");
    playerWins();
  } else if (playerHasBlackjack && !dealerHasBlackjack) {
    updateMessage("Blackjack! You win 3:2!");
    playerWins(true);
  } else if (dealerHasBlackjack && !playerHasBlackjack) {
    updateMessage("Dealer has Blackjack! You lose.");
    playerLoses();
  } else if (playerScore > dealerScore) {
    updateMessage("You win!");
    playerWins();
  } else if (dealerScore > playerScore) {
    updateMessage("Dealer wins.");
    playerLoses();
  } else {
    updateMessage("Push - it's a tie!");
    playerPush();
  }

  setGameState('gameOver');

  return {
    playerScore,
    dealerScore,
    winner: playerScore > dealerScore ? 'player' :
      dealerScore > playerScore ? 'dealer' : 'push'
  };
}

/**
 * Processes player win, adding winnings to player money
 * @param {boolean} blackjack - Whether the win was via blackjack (pays 3:2)
 * @returns {number} - The amount won
 */
function playerWins(blackjack = false) {
  const winAmount = blackjack ? currentBet * 1.5 : currentBet;
  playerMoney += winAmount + currentBet; // Return bet + winnings
  currentBet = 0;
  
  updateMoneyDisplay();
  updateBetDisplay();
  
  return winAmount;
}

/**
 * Processes player loss
 * @returns {number} - The player's remaining money
 */
function playerLoses() {
  // Bet is already subtracted, just reset current bet
  currentBet = 0;
  updateBetDisplay();
  
  // Check if player is out of money
  if (playerMoney <= 0) {
    updateMessage("Game over! You're out of money. Refresh to start over.");
  }
  
  // Save updated money to local storage
  savePlayerMoney(playerMoney);
  
  return playerMoney;
}

/**
 * Processes a push (tie), returning the bet to the player
 * @returns {number} - The player's updated money
 */
function playerPush() {
  // Return the bet amount
  playerMoney += currentBet;
  currentBet = 0;
  
  updateMoneyDisplay();
  updateBetDisplay();
  
  return playerMoney;
}

/**
 * Starts a new round of play
 * @returns {boolean|string} - False if no bet placed, otherwise the game state
 */
async function startNewRound() {
  if (currentBet <= 0) {
    updateMessage("Please place a bet first!");
    return false;
  }
  
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

/**
 * Sets up event listeners for game actions
 */
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
  
  // Betting event handlers
  document.addEventListener('bet-chip', (event) => {
    const chipValue = parseInt(event.detail.value);
    if (!isNaN(chipValue) && chipValue > 0) {
      placeBet(chipValue);
      updateMessage(`Bet placed: $${chipValue}. Current bet: $${currentBet}`);
    }
  });
  
  document.addEventListener('clear-bet', () => {
    clearBet();
    updateMessage("Bet cleared. Place your bet and press DEAL to start.");
  });
  
  document.addEventListener('bet-all-in', () => {
    allInBet();
    updateMessage(`Going all in! Bet: $${currentBet}`);
  });
}

/**
 * Gets the position of an element on the page
 * @param {HTMLElement} element - The element to get position for
 * @returns {Object} - Object containing x and y coordinates
 */
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}

/**
 * Creates an animated card that moves from source to target position
 * @param {string} cardId - The ID of the card to create
 * @param {Object} sourcePosition - Starting position coordinates
 * @param {Object} targetPosition - Ending position coordinates
 * @param {Function} onComplete - Callback function when animation completes
 * @returns {HTMLElement} - The created animated card element
 */
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

/**
 * Adds a card to a container with animation
 * @param {HTMLElement} container - The container to add the card to
 * @param {string} cardId - The ID of the card to add
 * @param {boolean} faceDown - Whether the card should be face down
 * @returns {Promise<HTMLElement>} - Promise resolving to the added card element
 */
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

/**
 * Deals a random card to a container with animation
 * @param {HTMLElement} container - The container to deal to
 * @param {boolean} faceDown - Whether the card should be face down
 * @returns {Promise<HTMLElement>} - Promise resolving to the new card element
 */
function dealRandomCardToWithAnimation(container, faceDown = false) {
  const suits = ['H', 'D', 'C', 'S'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomValue = values[Math.floor(Math.random() * values.length)];
  const cardId = `${randomSuit}${randomValue}`;

  return addCardToContainerWithAnimation(container, cardId, faceDown);
}

/**
 * Deals the initial cards to both player and dealer with animation
 * @param {HTMLElement} playerContainer - The player's card container
 * @param {HTMLElement} dealerContainer - The dealer's card container
 * @returns {Promise<Object>} - Promise resolving to object with player and dealer cards
 */
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

/**
 * Initialize the game when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const playerArea = document.querySelector('#player-cards');
  const dealerArea = document.querySelector('#dealer-cards');
  const playerScore = document.querySelector('#player-score');
  const dealerScore = document.querySelector('#dealer-score');
  const messageArea = document.querySelector('#message-display');
  const playerMoneyDisplay = document.querySelector('#player-money-display');
  const currentBetDisplay = document.querySelector('#current-bet-display');
  
  if (playerArea && dealerArea && playerScore && dealerScore && messageArea) {
    initializeGame(playerArea, dealerArea, playerScore, dealerScore, messageArea, playerMoneyDisplay, currentBetDisplay);
    setupGameEventListeners();
  }
  
  const originalSetGameState = setGameState;
  setGameState = function(state) {
    document.body.setAttribute('data-game-state', state);
    return originalSetGameState(state);
  };
});