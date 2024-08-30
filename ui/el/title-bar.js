
import { LitElement, html, css, nothing } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing, toggleSideBar, $uiSideBarButtonShowing } from '../stores/ui.js';
import { $loggedIn } from '../stores/identity.js';

export class PolypodTitleBar extends withStores(LitElement, [$loggedIn, $uiSideBarShowing, $uiSideBarButtonShowing]) {
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
        display: flex;
        align-items: center;
        min-width: var(--pod-osx-title-bar-height);
        min-height: var(--pod-osx-title-bar-height);
        border-right: 1px solid var(--pod-mid-grey);
      }
      #title {
        display: flex;
        align-items: center;
        width: -webkit-fill-available;
        background: var(--pod-lightest);
        height: 100%;
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
  render () {
    const open = $uiSideBarShowing.get();
    const label = open ? 'Hide side bar' : 'Show side bar';
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
      </div>
    `;
  }
}

customElements.define('pod-title-bar', PolypodTitleBar);
