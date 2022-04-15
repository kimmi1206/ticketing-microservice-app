export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message); // equivalent to new Error('string');
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
