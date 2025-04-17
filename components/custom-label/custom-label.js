class Label extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Load HTML & CSS templates
    const [html, css] = await Promise.all([
      fetch('./components/custom-label/custom-label.html').then(r => {
        if (!r.ok) throw new Error('HTML fetch failed');
        return r.text();
      }),
      fetch('./components/custom-label/custom-label.css').then(r => {
        if (!r.ok) throw new Error('CSS fetch failed');
        return r.text();
      }),
    ]);
    

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    console.log(template.innerHTML)
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    
   
  }
}

customElements.define('custom-label', Label);
