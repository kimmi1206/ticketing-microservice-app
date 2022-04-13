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

// interface doesn't exist in javascript, so it's best to use Abstract classes
// export interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }
