import { Field } from '~/utils/fields';
import { InvalidRequestBodyError } from '~/errors/common';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'AuthorizationError';
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string) {
    super(message);

    this.name = 'InvalidCredentialsError';
  }
}

export class InvalidAuthRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);
    this.name = 'InvalidAuthRequestBodyError';
  }
}
