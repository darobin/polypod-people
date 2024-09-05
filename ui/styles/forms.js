
import { css } from 'lit';

const formStyles = css`
sl-input {
  margin-bottom: var(--sl-spacing-medium);
}
div.action-bar {
  text-align: right;
}

form.compact sl-input {
  margin-bottom: var(--sl-spacing-x-small);
}

/* Invalid forms */
sl-input[data-user-invalid]::part(base),
sl-select[data-user-invalid]::part(combobox),
sl-checkbox[data-user-invalid]::part(control) {
  border-color: var(--sl-color-danger-600);
}

[data-user-invalid]::part(form-control-label),
[data-user-invalid]::part(form-control-help-text),
sl-checkbox[data-user-invalid]::part(label) {
  color: var(--sl-color-danger-700);
}

sl-checkbox[data-user-invalid]::part(control) {
  outline: none;
}

sl-input:focus-within[data-user-invalid]::part(base),
sl-select:focus-within[data-user-invalid]::part(combobox),
sl-checkbox:focus-within[data-user-invalid]::part(control) {
  border-color: var(--sl-color-danger-600);
  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
}
`;
export default formStyles;
