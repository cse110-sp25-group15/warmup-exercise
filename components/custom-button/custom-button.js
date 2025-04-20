class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['disabled', 'hit', 'stay', 'deal', 'bet-chip', 'clear-bet', 'bet-all-in'];
  }

  async connectedCallback() {
    // Load HTML & CSS templates
    const [html, css] = await Promise.all([
      fetch('./components/custom-button/custom-button.html').then(r => r.text()),
      fetch('./components/custom-button/custom-button.css').then(r => r.text())
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const button = this.shadowRoot.querySelector('.custom-button');

    // Check if the disabled attribute is present and update the class accordingly
    this.updateDisabledState();
    
    // Update chip styling if applicable
    this.updateChipStyling();

    // add event listener to button
    button.addEventListener('click', (event) => {
      // Don't dispatch events if button is disabled
      if (this.hasAttribute('disabled')) {
        return;
      }
      
      if (this.hasAttribute('hit')) {
        // create new event
        const hitEvent = new CustomEvent('hit', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(hitEvent);
      }
      if (this.hasAttribute('stay')) {
        // create new event
        const stayEvent = new CustomEvent('stay', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(stayEvent);
      }
      if (this.hasAttribute('deal')) {
        // create new event
        const dealEvent = new CustomEvent('deal', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(dealEvent);
      }
      if (this.hasAttribute('bet-chip')) {
        // create new event with chip value
        const chipValue = this.getAttribute('bet-chip');
        const betChipEvent = new CustomEvent('bet-chip', {
          bubbles: true,
          composed: true,
          detail: { value: chipValue }
        });
        this.dispatchEvent(betChipEvent);
      }
      if (this.hasAttribute('clear-bet')) {
        // create new event
        const clearBetEvent = new CustomEvent('clear-bet', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(clearBetEvent);
      }
      if (this.hasAttribute('bet-all-in')) {
        // create new event
        const betAllInEvent = new CustomEvent('bet-all-in', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(betAllInEvent);
      }
    });
  }

  // Helper method to update the disabled state
  updateDisabledState() {
    const button = this.shadowRoot?.querySelector('.custom-button');
    if (!button) return;
    
    if (this.hasAttribute('disabled')) {
      button.classList.add('disabled');
      button.setAttribute('disabled', '');
    } else {
      button.classList.remove('disabled');
      button.removeAttribute('disabled');
    }
  }
  
  // Helper method to update chip styling
  updateChipStyling() {
    const button = this.shadowRoot?.querySelector('.custom-button');
    if (!button) return;
    
    // Apply chip styling if bet-chip attribute exists
    if (this.hasAttribute('bet-chip')) {
      const chipValue = this.getAttribute('bet-chip');
      button.classList.add('chip');
      button.classList.add(`chip-${chipValue}`);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this.updateDisabledState();
    }
    if (name === 'bet-chip') {
      this.updateChipStyling();
    }
  }
}

customElements.define('custom-button', CustomButton);