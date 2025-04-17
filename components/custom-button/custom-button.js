class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['disabled', 'hit', 'stay'];
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

    // Add create new event for mouse click to bubble up

    const button = this.shadowRoot.querySelector('.custom-button');

    // Check if the disabled attribute is present and update the class accordingly
    if (this.hasAttribute('disabled')) {
      button.classList.add('disabled');
    } else {
      button.classList.remove('disabled');
    } 

    // add event listener to button
    button.addEventListener('click', (event) => {
      if (this.hasAttribute('hit')){
        // create new event
        const hitEvent = new CustomEvent('hit', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(hitEvent);
      }
      if (this.hasAttribute('stay')){
        // create new event
        const stayEvent = new CustomEvent('stay', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(stayEvent);
      }
    })
  }



  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      const button = this.shadowRoot.querySelector('.custom-button');
      if (newValue !== null) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
    }
  }

}

customElements.define('custom-button', CustomButton);
