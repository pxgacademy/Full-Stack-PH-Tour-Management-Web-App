//

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    stack?: string
  ) {
    super(message);

    // Ensure correct prototype chain (important in TS when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);

    // Maintain proper stack trace
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
