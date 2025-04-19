class ContainerPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

  }

  async connectedCallback() {
    // Load HTML & CSS templates
    const [html, css] = await Promise.all([
      fetch('./components/container-player/container-player.html').then(r => r.text()),
      fetch('./components/container-player/container-player.css').then(r => r.text())
    ]);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    let label1Element;
    let label2Element;
    let playingCardsElement;
    let myInnerHTML = '';

    // create HTML for labels and playing cards from attributes
    const firstLabel = this.getAttribute('label1');
    if (firstLabel) {
      myInnerHTML +=  `
      <custom-label> ${firstLabel} </custom-label>
      `;
    }
    
    const playingCards = this.getAttribute('playing-cards');
    if (playingCards) {
      myInnerHTML += ` 
        <container-playarea card-ids=${playingCards}></container-playarea>
      `;
    }

    const secondLabel = this.getAttribute('label2');
    if (secondLabel) {
      myInnerHTML += ` 
        <custom-label> ${secondLabel} </custom-label>
      `;
    }

    this.shadowRoot.querySelector('.container-player').innerHTML = myInnerHTML;

    
  }
}

customElements.define('container-player', ContainerPlayer);