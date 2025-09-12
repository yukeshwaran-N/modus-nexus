// For server-side use only (Node.js environment)
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'modus-nexus-super-secret-jwt-key-2024';
const JWT_EXPIRES_IN = '24h';

export interface JwtPayload {
  userId: string;
  email: string;
  badgeNumber: string;
  name: string;
  rank: string;
  department: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
};