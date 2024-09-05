
import { LitElement, html, css, nothing } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing, $uiAddingPod, showAddingPod, hideAddingPod, } from '../stores/ui.js';
import { $rooms, createRoom } from '../stores/matrix.js';
import formStyles from '../styles/forms.js';
import { handleForm } from '../lib/form.js';

export class PolypodSideBar extends withStores(LitElement, [$uiSideBarShowing, $uiAddingPod, $rooms]) {
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
      ul li {
        display: flex;
        list-style-type: none;
        padding: var(--sl-spacing-x-small) 0;
        align-items: center;
        cursor: pointer;
        color: inherit;
      }
      ul li:hover {
        color: var(--pod-dark);
        text-decoration: underline;
        text-decoration-color: var(--pod-bright);
      }
      ul li.add-pod, ul li.add-pod:hover {
        text-decoration: none;
        cursor: default;
        color: inherit;
      }
      ul li sl-icon {
        margin-right: var(--sl-spacing-x-small);
      }
      li.action {
        display: flex;
        justify-content: right;
      }
      form {
        width: 100%;
      }
      `,
      formStyles
  ];

  handleSelectRoom (ev) {
    const rid = ev.target?.dataSet?.roomId;
    if (!rid) return;
    // XXX select
  }
  async handleAddPod (ev) {
    const data = handleForm(ev);
    await createRoom(data.name);
    hideAddingPod();
  }
  // XXX ONGOING PROBLEMS
  // - Got room state event for unknown room !GKZdFA2YaPEkAJVvhx:matrix.polypod.bast!
  // - Doesn't refresh room list
  // - mounts rooms twice

  render () {
    const rooms = Object.values($rooms.get());
    const list = rooms?.length
      ? rooms.map(r => r ? html`<li data-room-id=${r.roomId}><sl-icon name="person-video"></sl-icon> ${r.name}</li>` : nothing)
      : html`<li class="no-results">No pods.</li>`
    ;
    const addPodForm = $uiAddingPod.get()
      ? html`<li class="add-pod">
          <form @submit=${this.handleAddPod} class="compact">
            <sl-divider></sl-divider>
            <sl-input name="name" required></sl-input>
            <div class="action-bar">
              <sl-button @click=${hideAddingPod} size="small" variant="danger">Cancel</sl-button>
              <sl-button type="submit" size="small" variant="primary">Add</sl-button>
            </div>
          </form>
        </li>`
      : nothing
    ;
    return html`
      <div id="root" class=${$uiSideBarShowing.get() ? 'open' : 'closed'}>
        <sl-card id="pods">
          <h2 slot="header"><sl-icon name="collection"></sl-icon> Pods</h2>
          <ul @click=${this.handleSelectRoom}>
            ${list}
            ${addPodForm}
            <li class="action">
              <sl-button @click=${showAddingPod} ?disabled=${$uiAddingPod.get()}>
                <sl-icon slot="prefix" name="plus-square"></sl-icon> Add Pod
              </sl-button>
            </li>
          </ul>
        </sl-card>
      </div>
    `;
  }
}

customElements.define('pod-side-bar', PolypodSideBar);
