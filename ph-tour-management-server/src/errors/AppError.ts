//

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public path?: string,
    customName?: string,
    stack?: string
  ) {
    super(message);

    // Ensure correct prototype chain (important in TS when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);

    // Override of built-in name
    if (customName) this.name = customName;

    // Maintain proper stack trace
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
