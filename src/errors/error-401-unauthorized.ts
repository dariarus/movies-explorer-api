class UnauthorizedError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 401;
  }

  static get DEFAULT_MESSAGE() {
    return 'Неверные почта или пароль';
  }

  constructor(message = UnauthorizedError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
  }
}

export default UnauthorizedError;
