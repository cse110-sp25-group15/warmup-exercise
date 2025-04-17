class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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

  }
}

customElements.define('custom-button', CustomButton);
