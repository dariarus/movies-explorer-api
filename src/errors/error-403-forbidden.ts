class ForbiddenChangesError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 403;
  }

  static get DEFAULT_MESSAGE() {
    return 'Нельзя удалять фильмы, сохраненные не Вами';
  }

  constructor(message = ForbiddenChangesError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = ForbiddenChangesError.DEFAULT_STATUS_CODE;
  }
}

export default ForbiddenChangesError;
