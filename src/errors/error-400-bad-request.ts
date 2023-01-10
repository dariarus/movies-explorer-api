class BadRequestError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 400;
  }

  static get DEFAULT_MESSAGE() {
    return 'Неверно сформирован запрос';
  }

  constructor(message = BadRequestError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = BadRequestError.DEFAULT_STATUS_CODE;
  }
}

export default BadRequestError;
