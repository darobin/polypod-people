
import { LitElement, html, css } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing } from '../stores/ui.js';
import { $rooms } from '../stores/matrix.js';

export class PolypodSideBar extends withStores(LitElement, [$uiSideBarShowing, $rooms]) {
  static styles = [
    css`
      #root {
        position: fixed;
        top: var(--pod-osx-title-bar-height);
        left: calc(-1 * var(--pod-side-bar-width));
        bottom: 0;
        width: var(--pod-side-bar-width);
        transition: left var(--sl-transition-medium);
        background: var(--pod-neutral-grey);
      }
      #root.open {
        left: 0;
      }
      a {
        flex-grow: 1;
        color: inherit;
        text-decoration: none;
      }
      h2 {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 700;
        font-variation-settings: "wght" 700; /* Chrome doesn't apply font-weight correctly. */
        margin: 0;
      }
      h2 > sl-icon {
        margin-right: var(--sl-spacing-small);
        min-width: var(--sl-spacing-large);
        min-height: var(--sl-spacing-large);
      }
      sl-card {
        display: block;
        margin: var(--sl-spacing-medium);
      }
      sl-card::part(header) {
        border-bottom: none;
      }
      sl-card::part(body) {
        border-bottom: none;
        padding: calc(var(--padding)  / 2) var(--padding);
      }
      sl-card.no-body::part(body) {
        padding: 0;
      }
      sl-card ul {
        margin: 0;
        padding: 0;
      }
      li.no-results {
        list-style-type: none;
        color: var(--sl-color-neutral-500);
      }
      `
  ];

  handleSelectRoom (ev) {
    const rid = ev.target?.dataSet?.roomId;
    if (!rid) return;
    // XXX select
  }

  render () {
    const rooms = Object.values($rooms.get());
    const list = rooms?.length
      ? rooms.map(r => html`<li data-room-id=${r.roomId}>${r.name}</li>`)
      : html`<li class="no-results">No pods.</li>`
    ;
    return html`
      <div id="root" class=${$uiSideBarShowing.get() ? 'open' : 'closed'}>
        <sl-card id="pods">
          <h2 slot="header"><sl-icon name="collection"></sl-icon> Pods</h2>
          <ul @click=${this.handleSelectRoom}>
            ${list}
          </ul>
        </sl-card>
      </div>
    `;
  }
}

customElements.define('pod-side-bar', PolypodSideBar);
