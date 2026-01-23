export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists');
    this.name = 'EmailAlreadyExistsError';
  }
}

export class TokensMismatchError extends Error {
  constructor() {
    super("Tokens don't match");
    this.name = 'TokensMismatchError';
  }
}

export class EmailDoNotExistOnVerify extends Error {
  constructor() {
    super("Email don't exist");
    this.name = 'EmailDoNotExistOnVerifyError';
  }
}
