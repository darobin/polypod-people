
import { LitElement, html, css, nothing } from 'lit';
import { withStores } from "@nanostores/lit";
import { $uiSideBarShowing, $uiSelectedPod } from '../stores/ui.js';

export class PolypodDocumentList extends withStores(LitElement, [$uiSideBarShowing, $uiSelectedPod]) {
  static styles = [
    css`
      #root {
        display: flex;
        align-items: center;
        /* NOTE: this is OSX-specific */
        /* padding-left: var(--pod-traffic-light-padding); */
        padding-left: 0;
        transition: padding-left var(--sl-transition-medium);
      }
      #root.open {
        /* NOTE: this is OSX-specific and assumes 400px wide */
        padding-left: var(--pod-side-bar-width);
        /* padding-left: calc(var(--pod-side-bar-width) - var(--pod-osx-title-bar-height)); */
      }
    `
  ];
  render () {
    const pod = $uiSelectedPod.get();
    return html`
      <div id="root" class=${$uiSideBarShowing.get() ? 'open' : 'closed'}>
        ${pod ? `POD: ${pod.name.val}` : 'No pod selected.'}
      </div>
    `;
  }
}

customElements.define('pod-document-list', PolypodDocumentList);
