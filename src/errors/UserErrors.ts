// Custom error thrown when trying to register with an email thats already exists in the database.
export class EmailAlreadyUsedError extends Error {
  constructor(message = "Email already in use") {
    super(message);
    Object.setPrototypeOf(this, EmailAlreadyUsedError.prototype);
  }
}

// Custom error throw when a disposable/tempory email is used during registration.
export class DisposableEmailError extends Error {
  constructor(message = "Disposable email addresses are not allowed") {
    super(message);
    Object.setPrototypeOf(this, DisposableEmailError.prototype);
  }
}