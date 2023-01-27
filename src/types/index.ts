import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Schema } from 'mongoose';

export interface ICustomRequest extends Request {
  user?: {
    _id: Schema.Types.ObjectId
  }
}

export interface ISessionRequest extends Request {
  user?: string | JwtPayload;
}
