
import { LitElement, html, css, nothing } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing, $uiSelectedPod } from '../stores/ui.js';

export class PolypodDocumentList extends withStores(LitElement, [$uiSideBarShowing, $uiSelectedPod]) {
  static styles = [
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      #root {
        display: flex;
        align-items: center;
        justify-content: center;
        /* NOTE: this is OSX-specific */
        padding-left: 0;
        transition: padding-left var(--sl-transition-medium);
        height: 100%;
      }
      #root.open {
        /* NOTE: this is OSX-specific and assumes 400px wide */
        padding-left: var(--pod-side-bar-width);
      }
      .big-no {
        font-size: 4rem;
        font-weight: 900;
        color: var(--pod-bright);
        text-align: center;
      }
      li.no-results {
        list-style-type: none;
        color: var(--sl-color-neutral-500);
      }
      .pod {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .pod > ul {
        flex-grow: 1;
        list-style-type: none;
      }
      .status-actions {
        text-align: right;
        padding: var(--sl-spacing-small);
      }
      .pod > h2 {
        font-size: 1rem;
        font-variation-settings: "wght" 500;
        text-align: center;
        margin: var(--sl-spacing-small);
      }
      sl-icon-button {
        color: var(--pod-dark);
      }
      sl-icon-button:hover {
        color: var(--pod-bright);
      }
    `
  ];
  handleAddDocument () {
    // XXX
    // - prompt for type then name (use create* from automerge types)
    // - list of types is from some hardwired server API with built-in tiles
    // - list is a grid
    // - clicking a doc opens it in a new window, with special scheme
    // - scheme serves from server with injected API to get at shared state.
  }
  render () {
    const pod = $uiSelectedPod.get();
    let content;
    if (!pod) {
      content = html`<div>
        <div class="big-no">∅</div>
        <span>No selected pod.</span>
      </div>`;
    }
    else {
      const docs = pod.docs?.length
        ? docs.map(docid => html`<li><pod-doc-summary docid=${docid}></pod-doc-summary></li>`)
        : html`<li class="no-results">No documents.</li>`
      ;
      content = html`<div class="pod">
        <h2>${pod.name.val}</h2>
        <ul>
         ${docs}
        </ul>
        <div class="status-actions">
          <sl-tooltip content="Add document">
            <sl-icon-button name="plus-circle" label="Add document" style="font-size: 2rem;"></sl-icon-button>
          </sl-tooltip>
        </div>
      </div>`;
    }
    return html`
      <div id="root" class=${$uiSideBarShowing.get() ? 'open' : 'closed'}>
        ${content}
      </div>
    `;
  }
}

customElements.define('pod-document-list', PolypodDocumentList);
