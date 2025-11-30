import { TransformFnParams } from 'class-transformer';

export function Trim(params: TransformFnParams) {
  const value = params.value;

  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}
