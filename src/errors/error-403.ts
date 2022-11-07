class UserRightsError extends Error implements Error {
  statusCode: number;

  static get DEFAULT_STATUS_CODE() {
    return 403;
  }

  static get DEFAULT_MESSAGE() {
    return 'Нельзя удалять чужие карточки';
  }

  constructor(message = UserRightsError.DEFAULT_MESSAGE) {
    super(message);
    this.statusCode = UserRightsError.DEFAULT_STATUS_CODE;
  }
}

export default UserRightsError;
