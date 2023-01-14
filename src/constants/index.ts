export const CREATED = 201;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const INTERNAL_SERVER_ERROR = 500;

export const { DBMESTO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
export const { PORT = 3000 } = process.env;
