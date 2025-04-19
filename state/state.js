// Current functions we have:
// 1. addRandomCard() - Creates and adds a random card to the page
// 2. flipEarliestCard() - Finds the first card and toggles its flipped state

// Additional functions needed for a complete blackjack game:

// Initialize a new game
function initializeGame() {
  console.log('Initializing new blackjack game');
  
  // Clear any existing cards
  clearAllCards();
  
  // Reset scores
  resetScores();
  
  // Deal initial cards (2 for player, 2 for dealer with one face down)
  const playerCard1 = dealCardTo('player');
  const playerCard2 = dealCardTo('player');
  const dealerCard1 = dealCardTo('dealer');
  const dealerCard2 = dealCardTo('dealer', true); // Second dealer card is face down
  
  // Calculate and display initial scores
  updateScores();
  
  // Set game state to player's turn
  setGameState('playerTurn');
}

// Clear all cards from the table
function clearAllCards() {
  const cards = document.querySelectorAll('playing-card');
  cards.forEach(card => card.remove());
  console.log('Cleared all cards from the table');
}

// Reset player and dealer scores
function resetScores() {
  playerScore = 0;
  dealerScore = 0;
  document.querySelector('.player-score').textContent = playerScore;
  document.querySelector('.dealer-score').textContent = dealerScore;
  console.log('Reset scores: Player - 0, Dealer - 0');
}

// Deal a card to either the player or dealer
function dealCardTo(recipient, faceDown = false) {
  console.log(`Dealing card to ${recipient}`);
  
  // Create a new card
  const newCard = document.createElement('playing-card');
  
  // Set a random card ID
  const suits = ['H', 'D', 'C', 'S'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomValue = values[Math.floor(Math.random() * values.length)];
  newCard.setAttribute('card-id', `${randomSuit}${randomValue}`);
  
  // Set face down state if needed
  if (faceDown) {
    newCard.setAttribute('flipped', '');
  }
  
  // Add the card to the appropriate container
  const container = document.querySelector(`.${recipient}-cards`);
  container.appendChild(newCard);
  
  // Add card to the appropriate hand for score calculation
  if (recipient === 'player') {
    playerHand.push({ suit: randomSuit, value: randomValue });
  } else {
    dealerHand.push({ suit: randomSuit, value: randomValue });
  }
  
  console.log(`Dealt ${randomSuit}${randomValue} to ${recipient}`);
  return newCard;
}

// Calculate the score of a hand
function calculateHandScore(hand) {
  let score = 0;
  let aceCount = 0;
  
  for (const card of hand) {
    if (card.value === 'A') {
      aceCount++;
      score += 11;
    } else if (card.value === 'K' || card.value === 'Q' || card.value === 'J') {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
  
  // Adjust score for aces if needed
  while (score > 21 && aceCount > 0) {
    score -= 10; // Change an ace from 11 to 1
    aceCount--;
  }
  
  return score;
}

// Update displayed scores
function updateScores() {
  playerScore = calculateHandScore(playerHand);
  
  // Only calculate visible dealer cards for the display
  const visibleDealerHand = dealerHand.filter((card, index) => {
    const cardElement = document.querySelectorAll('.dealer-cards playing-card')[index];
    return !cardElement.hasAttribute('flipped');
  });
  
  dealerScore = calculateHandScore(visibleDealerHand);
  
  document.querySelector('.player-score').textContent = playerScore;
  document.querySelector('.dealer-score').textContent = dealerScore;
  
  console.log(`Updated scores: Player - ${playerScore}, Dealer - ${dealerScore}`);
}

// Handle hit action
function handleHit() {
  console.log('Player hits');
  
  if (gameState !== 'playerTurn') {
    console.log('Cannot hit - not player\'s turn');
    return;
  }
  
  // Deal a card to the player
  dealCardTo('player');
  
  // Update scores
  updateScores();
  
  // Check if player busts
  if (playerScore > 21) {
    console.log('Player busts!');
    endGame('dealerWin');
  }
}

// Handle stay action
function handleStay() {
  console.log('Player stays');
  
  if (gameState !== 'playerTurn') {
    console.log('Cannot stay - not player\'s turn');
    return;
  }
  
  // Flip dealer's face-down card
  const dealerCards = document.querySelectorAll('.dealer-cards playing-card');
  for (const card of dealerCards) {
    if (card.hasAttribute('flipped')) {
      card.removeAttribute('flipped');
    }
  }
  
  // Update scores with all dealer cards visible
  updateScores();
  
  // Now it's dealer's turn
  dealerTurn();
}

// Handle dealer's turn
function dealerTurn() {
  console.log('Dealer\'s turn');
  setGameState('dealerTurn');
  
  // Calculate dealer's actual score with all cards
  const realDealerScore = calculateHandScore(dealerHand);
  
  // Dealer hits on 16 or less, stays on 17 or more
  const dealerDecision = () => {
    if (realDealerScore < 17) {
      // Dealer takes a card
      dealCardTo('dealer');
      
      // Update scores
      updateScores();
      
      // Recalculate full dealer score
      const newRealDealerScore = calculateHandScore(dealerHand);
      
      // Check if dealer busts
      if (newRealDealerScore > 21) {
        console.log('Dealer busts!');
        endGame('playerWin');
        return;
      }
      
      // Continue dealer turn with a slight delay
      setTimeout(dealerDecision, 1000);
    } else {
      // Dealer stays, determine winner
      determineWinner();
    }
  };
  
  // Start dealer decision process with a delay
  setTimeout(dealerDecision, 1000);
}

// Determine the winner
function determineWinner() {
  const realDealerScore = calculateHandScore(dealerHand);
  
  console.log(`Final scores: Player - ${playerScore}, Dealer - ${realDealerScore}`);
  
  if (playerScore > realDealerScore) {
    console.log('Player wins!');
    endGame('playerWin');
  } else if (realDealerScore > playerScore) {
    console.log('Dealer wins!');
    endGame('dealerWin');
  } else {
    console.log('It\'s a tie!');
    endGame('tie');
  }
}

// End the game with a result
function endGame(result) {
  setGameState('gameOver');
  
  // Display result message
  const resultMessage = document.querySelector('.result-message');
  
  switch (result) {
    case 'playerWin':
      resultMessage.textContent = 'You win!';
      break;
    case 'dealerWin':
      resultMessage.textContent = 'Dealer wins!';
      break;
    case 'tie':
      resultMessage.textContent = 'It\'s a tie!';
      break;
  }
  
  // Show play again button
  document.querySelector('.play-again-button').style.display = 'block';
}

// Set the current game state
function setGameState(state) {
  gameState = state;
  console.log(`Game state changed to: ${state}`);
  
  // Update UI based on game state
  const hitButton = document.querySelector('custom-button[hit]');
  const stayButton = document.querySelector('custom-button[stay]');
  
  switch (state) {
    case 'playerTurn':
      hitButton.removeAttribute('disabled');
      stayButton.removeAttribute('disabled');
      break;
    case 'dealerTurn':
    case 'gameOver':
      hitButton.setAttribute('disabled', '');
      stayButton.setAttribute('disabled', '');
      break;
  }
}

// Remove a specific card (useful for animations or special rules)
function removeCard(cardElement) {
  console.log('Removing card:', cardElement.getAttribute('card-id'));
  cardElement.remove();
}

// Initialize game state and hands
let gameState = 'notStarted';
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;

// Set up event listeners for game actions
document.addEventListener('DOMContentLoaded', () => {
  // Hit button event
  document.addEventListener('hit', () => {
    handleHit();
  });
  
  // Stay button event
  document.addEventListener('stay', () => {
    handleStay();
  });
  
  // Play again button event
  document.querySelector('.play-again-button').addEventListener('click', () => {
    initializeGame();
  });
  
  // Start the game
  initializeGame();
});