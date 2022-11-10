class InternalServerError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 500;
  }

  static get DEFAULT_MESSAGE() {
    return 'На сервере произошла ошибка';
  }

  constructor(message = InternalServerError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = InternalServerError.DEFAULT_STATUS_CODE;
  }
}

export default InternalServerError;
