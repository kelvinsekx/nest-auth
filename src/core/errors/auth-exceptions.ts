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

export class EmailDoNotExistOnReset extends Error {
  constructor() {
    super("Email don't exist");
    this.name = 'EmailDoNotExistOnResetError';
  }
}

export class ResetTokenWasUsed extends Error {
  constructor() {
    super('Reset token already used');
    this.name = 'ResetTokenWasUsedError';
  }
}
