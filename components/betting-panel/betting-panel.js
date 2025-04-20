class BettingPanel extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      // Load HTML & CSS templates
      const [html, css] = await Promise.all([
        fetch('./components/betting-panel/betting-panel.html').then(r => r.text()),
        fetch('./components/betting-panel/betting-panel.css').then(r => r.text())
      ]);
  
      const template = document.createElement('template');
      template.innerHTML = `
        <style>${css}</style>
        ${html}
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    
    // Update displays based on external state
    updateView(playerMoney, currentBet) {
      if (this.shadowRoot) {
        this.shadowRoot.getElementById('player-money-display').textContent = playerMoney;
        this.shadowRoot.getElementById('current-bet-display').textContent = currentBet;
      }
    }
  }
  
  customElements.define('betting-panel', BettingPanel);