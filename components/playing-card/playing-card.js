class PlayingCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Define which attributes to observe for changes
  static get observedAttributes() {
    return ['card-id', 'flipped'];
  }

  async connectedCallback() {
    // Load HTML & CSS templates
    const [html, css] = await Promise.all([
      fetch('./components/playing-card/playing-card.html').then(r => r.text()),
      fetch('./components/playing-card/playing-card.css').then(r => r.text())
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Initial card setup
    this.updateCardImage();
    
    // Apply flipped state if the attribute was set before connection
    if (this.hasAttribute('flipped')) {
      this.shadowRoot.querySelector('.card').classList.add('flipped');
    }

    // Click to flip
    const card = this.shadowRoot.querySelector('.card');
    card.addEventListener('click', () => {
      if (card.classList.contains('flipped')) {
        this.removeAttribute('flipped');
      } else {
        this.setAttribute('flipped', '');
      }
    });
  }
  
  // Update card image based on card-id attribute
  updateCardImage() {
    const cardId = this.getAttribute('card-id') || 'AS';
    const imgEl = this.shadowRoot.querySelector('.card-front .card-img');
    if (imgEl) {
      imgEl.src = `/assets/cards/full-cards/${cardId}.png`;
      imgEl.alt = `Playing card ${cardId}`;
    }
  }
  

  // Called when an observed attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'card-id' && oldValue !== newValue) {
      // Only update if the card-id actually changed
      if (this.isConnected && this.shadowRoot) {
        this.updateCardImage();
      }
    }
    
    if (name === 'flipped') {
      
        const card = this.shadowRoot.querySelector('.card');
        if (card) {
          if (newValue !== null) {
            card.classList.add('flipped');
          } else {
            card.classList.remove('flipped');
          }
        }
      

      const flippedEvent = new CustomEvent('flipped', {
        detail: { flipped: newValue !== null },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(flippedEvent);

    }
  }
}

customElements.define('playing-card', PlayingCard);