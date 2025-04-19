// Remove a specific card element
function removeCard(cardElement) {
  if (!cardElement) {
    console.log('No card provided to remove');
    return false;
  }
  
  console.log('Removing card:', cardElement.getAttribute('card-id'));
  cardElement.remove();
  return true;
}

// Remove all cards from the page
function clearAllCards() {
  const cards = document.querySelectorAll('playing-card');
  const count = cards.length;
  
  cards.forEach(card => card.remove());
  console.log(`Cleared ${count} cards from the page`);
  
  return count;
}

// Calculate the value of a card
function getCardValue(cardId) {
  if (!cardId || cardId.length < 2) {
    console.log('Invalid card ID');
    return null;
  }
  
  // Extract the value part (everything except the first character which is the suit)
  const value = cardId.substring(1);
  
  // Determine the numerical value
  if (value === 'A') {
    return 11; // Ace is initially 11, can be changed to 1 if needed
  } else if (value === 'K' || value === 'Q' || value === 'J') {
    return 10; // Face cards are worth 10
  } else {
    return parseInt(value); // Numerical cards are worth their value
  }
}

// Flip a specific card
function flipCard(cardElement) {
  if (!cardElement) {
    console.log('No card provided to flip');
    return false;
  }
  
  // Toggle the flipped attribute
  if (cardElement.hasAttribute('flipped')) {
    cardElement.removeAttribute('flipped');
    console.log('Card unflipped');
  } else {
    cardElement.setAttribute('flipped', '');
    console.log('Card flipped');
  }
  
  return true;
}

// Add a card to a specific container
function addCardToContainer(container, cardId, faceDown = false) {
  if (!container) {
    console.log('No container provided');
    return null;
  }
  
  // Create a new card element
  const newCard = document.createElement('playing-card');
  
  // Set card ID
  newCard.setAttribute('card-id', cardId);
  
  // Set face down state if needed
  if (faceDown) {
    newCard.setAttribute('flipped', '');
  }
  
  // Add card to container
  container.appendChild(newCard);
  console.log(`Added card ${cardId} to container`);
  
  return newCard;
}

// Deal a random card to a specific container (player or dealer area)
function dealRandomCardTo(container, faceDown = false) {
  // Generate random card ID
  const suits = ['H', 'D', 'C', 'S'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomValue = values[Math.floor(Math.random() * values.length)];
  const cardId = `${randomSuit}${randomValue}`;
  
  // Add the card to the container
  const newCard = addCardToContainer(container, cardId, faceDown);
  
  return newCard;
}

// Calculate the score of a collection of cards
function calculateHandScore(cards) {
  if (!cards || cards.length === 0) {
    return 0;
  }
  
  let score = 0;
  let aceCount = 0;
  
  // First pass: calculate initial score
  for (const card of cards) {
    const cardId = card.getAttribute('card-id');
    
    // Skip face-down cards if they don't have a card-id
    if (!cardId) continue;
    
    const value = getCardValue(cardId);
    
    if (value === 11) { // It's an Ace
      aceCount++;
    }
    
    score += value;
  }
  
  // Second pass: adjust for aces if needed
  while (score > 21 && aceCount > 0) {
    score -= 10; // Change an ace from 11 to 1
    aceCount--;
  }
  
  return score;
}

// Update a score display element with a new score
function updateScoreDisplay(displayElement, score) {
  if (!displayElement) {
    console.log('No display element provided');
    return false;
  }
  
  displayElement.textContent = score;
  console.log(`Updated score display to ${score}`);
  return true;
}

// Deal initial cards (2 to player, 2 to dealer with one face down)
function dealInitialCards(playerContainer, dealerContainer) {
  // Clear any existing cards first
  clearAllCards();
  
  // Deal to player (both face up)
  const playerCard1 = dealRandomCardTo(playerContainer);
  const playerCard2 = dealRandomCardTo(playerContainer);
  
  // Deal to dealer (one face up, one face down)
  const dealerCard1 = dealRandomCardTo(dealerContainer);
  const dealerCard2 = dealRandomCardTo(dealerContainer, true); // Second card face down
  
  console.log('Dealt initial cards');
  
  return {
    player: [playerCard1, playerCard2],
    dealer: [dealerCard1, dealerCard2]
  };
}

// Check if a hand is a bust (over 21)
function isBust(cards) {
  const score = calculateHandScore(cards);
  return score > 21;
}

// Check if a hand is blackjack (21 with exactly 2 cards)
function isBlackjack(cards) {
  if (cards.length !== 2) {
    return false;
  }
  
  const score = calculateHandScore(cards);
  return score === 21;
}


// ---- GAME LOGIC FUNCTIONS ----
// These functions implement the actual game mechanics

// Game state variables
let gameState = 'notStarted'; // Possible states: notStarted, playerTurn, dealerTurn, gameOver
let playerContainer = null;
let dealerContainer = null;
let playerScoreDisplay = null;
let dealerScoreDisplay = null;
let messageDisplay = null;

// Initialize the game with DOM references
function initializeGame(playerArea, dealerArea, playerScore, dealerScore, messageArea) {
  // Store references to DOM elements
  playerContainer = playerArea;
  dealerContainer = dealerArea;
  playerScoreDisplay = playerScore;
  dealerScoreDisplay = dealerScore;
  messageDisplay = messageArea;
  
  // Clear everything and set up for a new game
  clearAllCards();
  updateScoreDisplay(playerScoreDisplay, 0);
  updateScoreDisplay(dealerScoreDisplay, 0);
  updateMessage('Welcome to Blackjack! Press "Deal" to start.');
  
  // Set initial game state
  setGameState('notStarted');
  
  console.log('Game initialized');
}

// Update the game message display
function updateMessage(message) {
  if (messageDisplay) {
    messageDisplay.textContent = message;
    console.log(`Message updated: ${message}`);
  }
}

// Set the current game state
function setGameState(state) {
  gameState = state;
  console.log(`Game state changed to: ${state}`);
  
  // You could add logic here to enable/disable buttons based on state
  return gameState;
}

// Start a new round
function startNewRound() {
  // Deal initial cards
  dealInitialCards(playerContainer, dealerContainer);
  
  // Calculate and update scores
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  const visibleDealerCards = getVisibleCards(dealerCards);
  
  const playerScore = calculateHandScore(playerCards);
  const dealerScore = calculateHandScore(visibleDealerCards);
  
  updateScoreDisplay(playerScoreDisplay, playerScore);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);
  
  // Check for initial blackjacks
  if (isBlackjack(playerCards)) {
    if (isBlackjack(dealerCards)) {
      // Both have blackjack - it's a push
      revealDealerCards();
      updateMessage("Both have Blackjack! It's a push.");
      setGameState('gameOver');
    } else {
      // Player has blackjack but dealer doesn't
      revealDealerCards();
      updateMessage("Blackjack! You win!");
      setGameState('gameOver');
    }
  } else {
    // Regular play continues
    updateMessage("Your turn - Hit or Stay?");
    setGameState('playerTurn');
  }
  
  return gameState;
}

// Handle player hitting (taking another card)
function handlePlayerHit() {
  if (gameState !== 'playerTurn') {
    console.log('Cannot hit - not player\'s turn');
    return false;
  }
  
  // Deal a card to the player
  dealRandomCardTo(playerContainer);
  
  // Calculate and update score
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const playerScore = calculateHandScore(playerCards);
  updateScoreDisplay(playerScoreDisplay, playerScore);
  
  // Check if player busts
  if (playerScore > 21) {
    updateMessage("Bust! Dealer wins.");
    setGameState('gameOver');
  }
  
  return true;
}

// Handle player staying (ending their turn)
function handlePlayerStay() {
  if (gameState !== 'playerTurn') {
    console.log('Cannot stay - not player\'s turn');
    return false;
  }
  
  // Move to dealer's turn
  setGameState('dealerTurn');
  updateMessage("Dealer's turn");
  
  // Reveal dealer's cards
  revealDealerCards();
  
  // Execute dealer's turn
  executeDealerTurn();
  
  return true;
}

// Reveal all of dealer's cards
function revealDealerCards() {
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  
  for (const card of dealerCards) {
    if (card.hasAttribute('flipped')) {
      flipCard(card);
    }
  }
  
  // Update dealer score with all cards visible
  const visibleDealerCards = getVisibleCards(dealerCards);
  const dealerScore = calculateHandScore(visibleDealerCards);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);
  
  return dealerScore;
}

// Execute dealer's turn (dealer hits on 16 or less, stays on 17 or more)
function executeDealerTurn() {
  if (gameState !== 'dealerTurn') {
    console.log('Cannot execute dealer turn - not dealer\'s turn');
    return false;
  }
  
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  let dealerScore = calculateHandScore(dealerCards);
  
  // Function to handle dealer's next move with a delay
  const dealerNextMove = () => {
    dealerScore = calculateHandScore(dealerCards);
    
    if (dealerScore < 17) {
      // Dealer hits
      updateMessage("Dealer hits");
      const newCard = dealRandomCardTo(dealerContainer);
      
      // Recalculate score
      dealerScore = calculateHandScore(dealerContainer.querySelectorAll('playing-card'));
      updateScoreDisplay(dealerScoreDisplay, dealerScore);
      
      if (dealerScore > 21) {
        // Dealer busts
        updateMessage("Dealer busts! You win!");
        setGameState('gameOver');
      } else {
        // Dealer continues with a delay
        setTimeout(dealerNextMove, 1000);
      }
    } else {
      // Dealer stays, determine winner
      determineWinner();
    }
  };
  
  // Start dealer's turn with a delay
  setTimeout(dealerNextMove, 1000);
  
  return true;
}

// Determine the winner of the round
function determineWinner() {
  const playerCards = playerContainer.querySelectorAll('playing-card');
  const dealerCards = dealerContainer.querySelectorAll('playing-card');
  
  const playerScore = calculateHandScore(playerCards);
  const dealerScore = calculateHandScore(dealerCards);
  
  // Update final scores
  updateScoreDisplay(playerScoreDisplay, playerScore);
  updateScoreDisplay(dealerScoreDisplay, dealerScore);
  
  if (playerScore > 21) {
    // Player busts, dealer wins
    updateMessage("Bust! Dealer wins.");
  } else if (dealerScore > 21) {
    // Dealer busts, player wins
    updateMessage("Dealer busts! You win!");
  } else if (playerScore > dealerScore) {
    // Player score is higher
    updateMessage("You win!");
  } else if (dealerScore > playerScore) {
    // Dealer score is higher
    updateMessage("Dealer wins.");
  } else {
    // Equal scores, it's a push
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

// Set up complete event listeners with game logic
function setupGameEventListeners() {
  // Hit button event
  document.addEventListener('hit', () => {
    console.log('Hit event received');
    if (gameState === 'playerTurn') {
      handlePlayerHit();
    }
  });
  
  // Stay button event
  document.addEventListener('stay', () => {
    console.log('Stay event received');
    if (gameState === 'playerTurn') {
      handlePlayerStay();
    }
  });
  
  // Deal button event (if you add one)
  document.addEventListener('deal', () => {
    console.log('Deal event received');
    startNewRound();
  });
  
  console.log('Game event listeners set up');
}