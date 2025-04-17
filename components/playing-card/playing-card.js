class PlayingCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

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

    const cardId = this.getAttribute('card-id') || 'AS';
    const imgEl = this.shadowRoot.querySelector('.card-front .card-img');
    if (imgEl) {
      imgEl.src = `/assets/cards/full_cards/${cardId}.png`;
      imgEl.alt = `Playing card ${cardId}`;
    }

    //Click to flip
    const card = this.shadowRoot.querySelector('.card');
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
   
  }
  
}

customElements.define('playing-card', PlayingCard);
