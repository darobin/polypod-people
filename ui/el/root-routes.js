
import { LitElement, html, css } from 'lit';
import { withStores } from "@nanostores/lit";
import { $router } from '../stores/router.js';

export class PolypodRootRoutes extends withStores(LitElement, [$router]) {
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ];
  render () {
    const { route } = $router.get();
    switch (route) {
      // XXX
      // - home has the sidebar, listing the rooms
      // - mount $syncState in here to determine if loading should be shown
      // - body is empty unless a room is selected (a $ui thing)
      case 'home':
        return html`<div>home sweet home (mount $syncState in here)</div>`;
      case 'login':
        return html`<pod-login></pod-login>`;
      case '404':
      default:
        return html`<pod-404></pod-404>`;
    }
  }
}

customElements.define('pod-root-routes', PolypodRootRoutes);
