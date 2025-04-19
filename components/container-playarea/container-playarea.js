class ContainerPlayArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

  }

  async connectedCallback() {
    // Load HTML & CSS templates
    const [html, css] = await Promise.all([
      fetch('./components/container-playarea/container-playarea.html').then(r => r.text()),
      fetch('./components/container-playarea/container-playarea.css').then(r => r.text())
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));


    // create playing cards from attributes
    const cardIds = this.getAttribute('card-ids');
    if (cardIds) {
      const cards = cardIds.split(',');

      const cardElements = cards.map(cardId => {
        return `<playing-card card-id="${cardId}"></playing-card>`;
      }).join('');
  
      this.shadowRoot.querySelector('.container-playarea').innerHTML = `
        ${cardElements}
      `;
    }
  }
}

customElements.define('container-playarea', ContainerPlayArea);