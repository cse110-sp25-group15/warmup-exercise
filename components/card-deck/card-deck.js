/* components/card-deck/card-deck.js  —  “smooth split‑riffle v3” */

const SPLIT_MS        = 450;   // outward halves
const HALF_SHUFFLE_MS = 550;   // slower in‑place shuffle
const MERGE_MS        = 520;   // halves slide back
const FLASH_MS        = 500;   // final riffle (250 out + 250 back)

const SPLIT_EASE  = 'cubic-bezier(.22,.68,0,1.31)';            // overshoot
const SMOOTH_EASE = 'cubic-bezier(.25,.8,.25,1)';              // smooth both ways
const MERGE_EASE  = 'ease-in-out';

class CardDeck extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  async connectedCallback() {
    const [html, css] = await Promise.all([
      fetch('./components/card-deck/card-deck.html').then(r => r.text()),
      fetch('./components/card-deck/card-deck.css').then(r => r.text())
    ]);
    const t = document.createElement('template');
    t.innerHTML = `<style>${css}</style>${html}`;
    this.shadowRoot.appendChild(t.content.cloneNode(true));

    this.shadowRoot.querySelector('#deck')
        .addEventListener('click', () =>
          splitRiffleSmooth(this.shadowRoot.querySelector('#deck')));
  }
}
customElements.define('card-deck', CardDeck);

/* ----------  main animation  ---------- */
async function splitRiffleSmooth(deckEl) {
  const cards = Array.from(
    deckEl.querySelectorAll('.card-1, .card-2, .card-3')
  );
  if (cards.length < 3) return;

  const [leftHalf, rightHalf] = splitArray(cards);

  /* 1) split outward */
  moveGroup(leftHalf,  -120, -24, -12, -8, SPLIT_MS, SPLIT_EASE);  // dx,dy,rotY,rotZ
  moveGroup(rightHalf,  120, -24,  12,  8, SPLIT_MS, SPLIT_EASE);
  await wait(SPLIT_MS);

  /* 2) shuffle each half with gentle jitter */
  jitterShuffle(leftHalf,  HALF_SHUFFLE_MS, SMOOTH_EASE);
  jitterShuffle(rightHalf, HALF_SHUFFLE_MS, SMOOTH_EASE);
  await wait(HALF_SHUFFLE_MS);

  /* 3) merge halves back together */
  moveGroup([...leftHalf, ...rightHalf], 0, 0, 0, 0, MERGE_MS, MERGE_EASE);
  await wait(MERGE_MS);

  /* 4) slower final flash riffle */
  await flashShuffle(deckEl, FLASH_MS, SMOOTH_EASE);
}

/* ---------- helpers ---------- */

function splitArray(arr) {
  const cut = Math.ceil(arr.length / 2);
  return [arr.slice(0, cut), arr.slice(cut)];
}

/* Move each card with given transforms */
function moveGroup(group, dx, dy, rotY, rotZ, ms, ease) {
  group.forEach(card => {
    card.style.transition = `transform ${ms}ms ${ease}`;
    card.style.transform  =
      `translate(${dx}px,${dy}px) rotateY(${rotY}deg) rotate(${rotZ}deg)`;
  });
}

/* Jitter inside one half and reorder DOM */
function jitterShuffle(group, ms, ease) {
  const rand = () => (Math.random()*80 - 40).toFixed(0); // ±40 px / deg
  group.forEach(card => {
    card.style.transition = `transform ${ms}ms ${ease}`;
    card.style.transform  =
      `translate(${rand()}px,${rand()}px) rotateY(${rand()}deg) rotate(${rand()}deg)`;
  });
  shuffleArray(group).forEach(c =>
    c.parentElement.insertBefore(c, c.parentElement.firstChild));
}

/* Final flash riffle of whole stack */
async function flashShuffle(deckEl, ms, ease) {
  const cards = Array.from(deckEl.querySelectorAll('.card-1, .card-2, .card-3'));
  const rand = () => (Math.random()*70 - 35).toFixed(0);
  cards.forEach(c => {
    c.style.transition = `transform ${ms/2}ms ${ease}`;
    c.style.transform  =
      `translate(${rand()}px,${rand()}px) rotateY(${rand()}deg) rotate(${rand()}deg)`;
  });
  await wait(ms/2);

  shuffleArray(cards).forEach(c => deckEl.insertBefore(c, deckEl.firstChild));
  cards.forEach(c => {
    c.style.transition = `transform ${ms/2}ms ${ease}`;
    c.style.transform  = 'translate(0,0) rotateY(0deg) rotate(0deg)';
  });
  await wait(ms/2);
}

/* utils */
function shuffleArray(a) { for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
const wait = ms => new Promise(r => setTimeout(r, ms));
