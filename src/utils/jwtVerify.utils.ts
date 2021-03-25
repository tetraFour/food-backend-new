import { Request } from 'express';
import jwt from 'jsonwebtoken';

type ITokenData = {
  userId: string;
  login: string;
};

export const JWTVerify = (req: Request) => {
  const { userId, login } = <ITokenData>(
    jwt.verify(req.cookies['ut'], String(process.env.JWT_SECRET))
  );

  return { userId, login };
};
