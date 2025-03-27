class HttpError extends Error {
  statusCode: number;

  // Define the constructor with types for statusCode and message
  constructor(statusCode: number, message: string) {
    super(message); // Call the parent class constructor with the message
    this.statusCode = statusCode; // Add the status code
    this.name = this.constructor.name; // Set the name of the error class
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export default HttpError;
