
const errCodes = {
  M_FORBIDDEN: 'Wrong username or password',
  M_USER_DEACTIVATED: 'User deactivated',
  M_USER_IN_USE: 'User already exists',
  M_INVALID_USERNAME: 'Invalid user name',
  M_EXCLUSIVE: 'User name reserved',
};

export function matrixErrorToMessage (err) {
  if (err?.data?.error) return err.data.error.replace(/\.$/, '');
  if (errCodes[err.errcode]) return errCodes[err.errcode];
  if (err.httpStatus && err.httpStatus >= 400) return `HTTP error code ${err.httpStatus}`;
  return err.message || `Unknown error`;
}
