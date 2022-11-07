class NotFoundError extends Error implements Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
