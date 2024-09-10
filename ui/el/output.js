
import { LitElement, html, css } from 'lit';
import { repo } from '../lib/automerge.js';

// XXX
// - takes an id and field
// - starts loading
// - finds that object, listens for changes
// - unlistens on removal
// - outputs value of field when found
// - or error state

export class PolypodOuput extends LitElement {
  static properties = {
    docid: {},
    field: {},
    dh: { state: true },
    doc: { state: true },
    loading: { state: true },
    error: { state: true },
  };
  static styles = [
    css`
      .error {
        color: var(--sl-color-danger-500);
      }
    `
  ];
  handleAutomergeChange (doc) {
    this.loading = false;
    this.error = false;
    this.doc = doc;
  }
  async connectedCallback () {
    super.connectedCallback();
    if (!this.docid || !this.field) return;
    try {
      this.error = false;
      this.loading = true;
      this.dh = repo.find(this.docid);
      const doc = await this.dh.doc();
      this.handleAutomergeChange(doc);
      this.dh.on('change', this.handleAutomergeChange);
    }
    catch (err) {
      this.loading = false;
      this.error = err.message;
    }
  }
  disconnectedCallback () {
    super.disconnectedCallback();
    if (this.dh) this.dh.off('off', this.handleAutomergeChange);
  }
  render () {
    if (this.error) {
      return html`<span class="error">${typeof this.error === 'string' ? this.error : 'Error'}</span>`;
    }
    if (this.loading) return html`<span><pod-loading></pod-loading></span>`;
    return html`<span>${this.doc[this.field]?.val}</span>`;
  }
}

customElements.define('pod-output', PolypodOuput);
