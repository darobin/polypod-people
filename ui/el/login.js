
import { LitElement, html, css } from 'lit';
import { withStores } from "@nanostores/lit";
import { $loggedIn, $loginLoading } from '../stores/identities.js';

export class PolypodLogin extends withStores(LitElement, [$loggedIn, $loginLoading]) {
  static styles = [
    css`
      :host {
        display: block;
        min-height: 100%;
      }
      pod-loading {
        position: absolute;
        top: 0;
        bottom: 0;
      }
    `
  ];
  render () {
    if ($loginLoading.get()) return html`<pod-loading></pod-loading>`
    return html`<div>login here</div>`;
  }
}

customElements.define('pod-login', PolypodLogin);
