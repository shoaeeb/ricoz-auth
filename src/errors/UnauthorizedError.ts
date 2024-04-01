import CustomApiError from "./CustomAPIError";

class UnauthorizedError extends CustomApiError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
