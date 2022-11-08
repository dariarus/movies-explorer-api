class UniqueFieldConflict extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 409;
  }

  static get DEFAULT_MESSAGE() {
    return 'Указанная почта уже зарегистрирована';
  }

  constructor(message = UniqueFieldConflict.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
  }
}

export default UniqueFieldConflict;
