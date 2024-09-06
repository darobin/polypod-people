
import { LitElement, html, css } from 'lit';
import { withStores } from "@nanostores/lit";
import { $loggedIn, $loginLoading, $loginError, $registrationError, login, register } from '../stores/identity.js';
import formStyles from '../styles/forms.js';
import { handleForm } from '../lib/form.js';

export class PolypodLogin extends withStores(LitElement, [$loggedIn, $loginLoading, $loginError, $registrationError]) {
  static styles = [
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
      }
      pod-loading {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      sl-card {
        min-width: 600px;
      }
    `,
    formStyles
  ];

  async handleLogin (ev) {
    const data = handleForm(ev);
    await login(data.username, data.password);
  }
  async handleRegistration (ev) {
    const data = handleForm(ev);
    await register(data.username, data['password-1'], data.token, data.name, data.email);
  }
  checkSamePassword (ev) {
    const input = ev.currentTarget;
    const pwd1 = this.shadowRoot.querySelector('[name="password-1"]').value;
    const pwd2 = input.value;
    if (pwd1 === pwd2) input.setCustomValidity('');
    else input.setCustomValidity("Passwords do not match.");
  }

  render () {
    if ($loginLoading.get()) return html`<pod-loading></pod-loading>`
    return html`
      <sl-card>
        <sl-tab-group>
          <sl-tab slot="nav" panel="login">Login</sl-tab>
          <sl-tab slot="nav" panel="register">Register</sl-tab>
          <sl-tab-panel name="login">
            <form @submit=${this.handleLogin}>
              <sl-alert variant="warning" ?open=${!!$loginError.get()} closable>
                <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                <strong>${$loginError.get()}</strong><br>
                Please trying logging in again to continue.
              </sl-alert>
              <sl-input label="User name" name="username" required></sl-input>
              <sl-input type="password" label="Password" name="password" password-toggle required></sl-input>
              <div class="action-bar">
                <sl-button type="submit">Ok</sl-button>
              </div>
            </form>
          </sl-tab-panel>
          <sl-tab-panel name="register">
            <form @submit=${this.handleRegistration}>
              <sl-alert variant="warning" ?open=${!!$registrationError.get()} closable>
                <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                <strong>${$registrationError.get()}</strong><br>
                Please fix the errors and try registering in again to continue.
              </sl-alert>
              <sl-input label="User name" name="username" required pattern="[a-z0-9\\._=\\/\\+\\-]{1,}"
                help-text="a-z, 0-9, ., _, =, /, +, or -"></sl-input>
              <sl-input label="Name" name="name" required></sl-input>
              <sl-input type="email" label="Email" name="email" required></sl-input>
              <sl-input type="password" label="Password" name="password-1" password-toggle required></sl-input>
              <sl-input type="password" label="Repeat password" name="password-2" password-toggle required 
                @sl-input=${this.checkSamePassword}></sl-input>
              <sl-input label="Token" name="token" required help-text="Someone should give you this to invite you over."></sl-input>
              <div class="action-bar">
                <sl-button type="submit">Ok</sl-button>
              </div>
            </form>
          </sl-tab-panel>
        </sl-tab-group>
      </sl-card>
    `;
  }
}

customElements.define('pod-login', PolypodLogin);
