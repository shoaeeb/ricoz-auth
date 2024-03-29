class CustomApiError extends Error {
  statusCode: number = 500;
  constructor(message: string) {
    super(message);
  }
}

export default CustomApiError;
