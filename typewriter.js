/**
 * typewriter.js — Vanilla JS typewriter / role cycler
 */

class Typewriter {
  constructor(element, options = {}) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    this.words        = options.words        || ['Business Analyst'];
    this.typeSpeed    = options.typeSpeed    || 80;
    this.deleteSpeed  = options.deleteSpeed  || 45;
    this.pauseAfter   = options.pauseAfter   || 1800;
    this.pauseBefore  = options.pauseBefore  || 400;
    this.loop         = options.loop         !== false;

    this.wordIndex  = 0;
    this.charIndex  = 0;
    this.deleting   = false;

    this._run();
  }

  _run() {
    const current = this.words[this.wordIndex % this.words.length];

    if (this.deleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.el.textContent = current.substring(0, this.charIndex);

    let delay = this.deleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.deleting && this.charIndex === current.length) {
      // Fully typed — pause then start deleting
      delay = this.pauseAfter;
      this.deleting = true;
    } else if (this.deleting && this.charIndex === 0) {
      // Fully deleted — move to next word
      this.deleting = false;
      this.wordIndex++;
      delay = this.pauseBefore;
    }

    setTimeout(() => this._run(), delay);
  }
}

export default Typewriter;
