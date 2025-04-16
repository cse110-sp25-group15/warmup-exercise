class CardDeck extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      // Load HTML & CSS templates
      const [html, css] = await Promise.all([
        fetch('./components/card-deck/card-deck.html').then(r => r.text()),
        fetch('./components/card-deck/card-deck.css').then(r => r.text())
      ]);
  
      const template = document.createElement('template');
      template.innerHTML = `
        <style>${css}</style>
        ${html}
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  
      // Add flip toggle
     
    }
  }
  
  customElements.define('card-deck', CardDeck);
  