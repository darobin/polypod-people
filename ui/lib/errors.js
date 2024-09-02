
const errCodes = {
  M_FORBIDDEN: 'Wrong username or password',
};

export function matrixErrorToMessage (err) {
  if (errCodes[err.errcode]) return errCodes[err.errcode];
  if (err.httpStatus && err.httpStatus >= 400) return `HTTP error code ${err.httpStatus}`;
  return `Unknown error`;
}
