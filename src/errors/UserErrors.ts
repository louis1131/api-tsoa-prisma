export class EmailAlreadyUsedError extends Error {
  constructor(message = "Email already in use") {
    super(message);
    Object.setPrototypeOf(this, EmailAlreadyUsedError.prototype);
  }
}