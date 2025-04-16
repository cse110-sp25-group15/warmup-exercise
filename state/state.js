const STORAGE_KEY = 'card-deck';

let deckState = {
  drawPile: [],     // Cards remaining in the deck (in order)
  discardPile: [],  // Cards that have been drawn
};


// DECK INITIALIZATION
// Each card is represented as a dictionary with { suit, value, id }.


/**
 * Initializes a new standard 52-card deck and resets the discard pile.
 * Saves the updated state to localStorage.
 */
export function initDeck() {
  // TODO
}

/**
 * Creates and returns a full standard deck of 52 playing cards.
 * Each card is a dictionary with properties: suit, value, id.
 * example: { suit: 'hearts', value: 'A', id: 'AH' }
 * @returns {Array<Object>} Ordered array of card objects
 */
export function createStandardDeck() {
  // TODO
}


// SHUFFLING


/**
 * Randomly shuffles the draw pile.
 * Discard pile is unaffected. Saves the updated state.
 */
export function shuffleDeck() {
  // TODO
}


// DRAWING CARDS


/**
 * Removes and returns the top card from the draw pile (front of array).
 * Adds the drawn card to the discard pile and saves the updated state.
 * @returns {Object|null} The drawn card, or null if draw pile is empty
 */
export function drawFromTop() {
  // TODO
}

/**
 * Removes and returns the bottom card from the draw pile (end of array).
 * Adds the drawn card to the discard pile and saves the updated state.
 * @returns {Object|null} The drawn card, or null if draw pile is empty
 */
export function drawFromBottom() {
  // TODO
}


// RESET / REINSERT


/**
 * Resets the deck to a new full 52-card deck.
 * Clears the discard pile and saves the updated state.
 */
export function resetDeck() {
  // TODO
}

/**
 * Moves all cards from the discard pile back into the draw pile.
 * Optionally shuffles the resulting draw pile. Saves the updated state.
 * @param {boolean} shuffle - Whether to shuffle the reinserted draw pile
 */
export function reinsertDiscardPile(shuffle = false) {
  // TODO
}


// PERSISTENCE


/**
 * Saves the current deck state to localStorage.
 */
export function saveDeck() {
  // TODO
}

/**
 * Loads the deck state from localStorage if it exists.
 * If not found, initializes a new deck. Returns the current state.
 * @returns {Object} The current deck state
 */
export function loadDeck() {
  // TODO
}


// GETTERS


/**
 * Returns the entire deck state object (draw and discard piles).
 * @returns {Object}
 */
export function getDeckState() {
  // TODO
}

/**
 * Returns the current draw pile.
 * @returns {Array<Object>}
 */
export function getDrawPile() {
  // TODO
}

/**
 * Returns the current discard pile.
 * @returns {Array<Object>}
 */
export function getDiscardPile() {
  // TODO
}
