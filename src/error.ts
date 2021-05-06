export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message ? `Not implemented: ${message}` : 'Not implemented');
  }
}
