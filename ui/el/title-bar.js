
import { LitElement, html, css, nothing } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing, toggleSideBar, $uiSideBarButtonShowing } from '../stores/ui.js';
import { $loggedIn, $user, logout } from '../stores/identity.js';

export class PolypodTitleBar extends withStores(LitElement, [$loggedIn, $user, $uiSideBarShowing, $uiSideBarButtonShowing]) {
  static styles = [
    css`
      #root {
        -webkit-app-region: drag;
        background: var(--pod-neutral-grey);
        display: flex;
        align-items: center;
        /* NOTE: this is OSX-specific */
        padding-left: var(--pod-traffic-light-padding);
        height: var(--pod-osx-title-bar-height);
        transition: padding-left var(--sl-transition-medium);
        border-bottom: 1px solid var(--pod-mid-grey);
      }
      #root.open {
        /* NOTE: this is OSX-specific and assumes 400px wide */
        padding-left: calc(var(--pod-side-bar-width) - var(--pod-osx-title-bar-height));
      }
      #icon-bar {
        -webkit-app-region: no-drag;
        display: flex;
        align-items: center;
        min-width: var(--pod-osx-title-bar-height);
        min-height: var(--pod-osx-title-bar-height);
        border-right: 1px solid var(--pod-mid-grey);
      }
      #title, #user {
        display: flex;
        align-items: center;
        background: var(--pod-lightest);
        height: 100%;
      }
      #title {
        width: -webkit-fill-available;
      }
      #user {
        -webkit-app-region: no-drag;
        padding-right: var(--sl-spacing-x-small);
      }
      sl-avatar {
        --size: 2rem;
      }
      sl-avatar::part(base) {
        background-color: var(--initials-bg);
      }
      h1 {
        display: flex;
        align-items: end;
        color: var(--pod-dark);
        padding: 0;
        margin: 0;
        font-family: var(--pod-title-font);
        font-size: var(--pod-large-text);
        font-weight: 100;
        font-variation-settings: "wght" 100; /* Chrome doesn't apply font-weight correctly. */
      }
      h1 img {
        height: var(--pod-osx-title-bar-height);
        margin-right: var(--sl-spacing-x-small);
      }
      sl-icon-button {
        font-size: var(--pod-large-text);
        color: var(--pod-electric-blue);
      }
    `
  ];
  handleAvatarMenu (ev) {
    const selectedItem = ev.detail.item;
    if (selectedItem === 'logout') logout();
  }
  render () {
    const open = $uiSideBarShowing.get();
    const label = open ? 'Hide side bar' : 'Show side bar';
    const user = $user.get();
    let userUI = nothing;
    if (user) {
      const initials = (user.name?.val || '?').replace(/^\s+|\s+$/, '').split(/\s+/).map(n => n[0]?.toUpperCase()).join('');
      userUI = html`<sl-dropdown @sl-select=${this.handleAvatarMenu} hoist distance="3">
        <sl-avatar slot="trigger" initials=${initials} style="--initials-bg: ${initials2hsl(initials, 80, 30)}"></sl-avatar>
        <sl-menu>
          <sl-menu-item value="logout">
            Log out
            <sl-icon slot="prefix" name="door-open"></sl-icon>
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>`;
    }
    return html`
      <div id="root" class=${open ? 'open' : 'closed'}>
        <div id="icon-bar">
          ${
            $uiSideBarButtonShowing.get()
            ? html`<sl-icon-button name="layout-sidebar" label=${label} @click=${toggleSideBar}></sl-icon-button>`
            : nothing
          }
        </div>
        <div id="title">
          <h1>
            <img src="app/img/icon.svg" alt="polypod logo">
            <span>polypod</span>
          </h1>
        </div>
        <div id="user">
          ${userUI}
        </div>
      </div>
    `;
  }
  updated () {
    setTimeout(() => {
      const slp = this.shadowRoot.querySelector('sl-dropdown')?.shadowRoot.querySelector('sl-popup');
      if (slp) {
        slp.setAttribute('arrow', 'arrow');
        slp.setAttribute('style', `--arrow-color: var(--sl-panel-border-color)`);
      }
    }, 0);
  }
}

function initials2hsl (initials, sat, lum) {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, ${sat}%, ${lum}%)`;
}

customElements.define('pod-title-bar', PolypodTitleBar);
