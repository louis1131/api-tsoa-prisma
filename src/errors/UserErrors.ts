export class EmailAlreadyUsedError extends Error {
  constructor(message = "Email already in use") {
    super(message);
    Object.setPrototypeOf(this, EmailAlreadyUsedError.prototype);
  }
}

export class DisposableEmailError extends Error {
  constructor(message = "Disposable email addresses are not allowed") {
    super(message);
    Object.setPrototypeOf(this, DisposableEmailError.prototype);
  }
}