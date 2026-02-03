// Custom HTTP error class that includes a status code.
// - `status`: HTTP status code to return
// - `message`: Error message
export class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype); // Ensures HttpError works correctly with instanceof
  }
}