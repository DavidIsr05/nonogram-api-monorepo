export const ERROR_TEXT_BASED_ON_EXCEPTION: Record<number | string, string> = {
  400: 'Validation error',
  401: 'Wrong credentials',
  404: 'User with that personal number does not exist',
  409: 'User with that personal number already exists',
  FETCH_ERROR: 'Could not fetch data from API',
};
