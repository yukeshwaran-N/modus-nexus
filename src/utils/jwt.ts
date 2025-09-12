import { SignJWT, jwtVerify, decodeJwt } from 'jose';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'modus-nexus-super-secret-jwt-key-2024';
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

const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET);
};

export const generateToken = async (payload: JwtPayload): Promise<string> => {
  const secretKey = getSecretKey();
  
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    badgeNumber: payload.badgeNumber,
    name: payload.name,
    rank: payload.rank,
    department: payload.department
  } as any) // Use type assertion to avoid jose library type issues
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
  
  return token;
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    
    if (payload && typeof payload === 'object') {
      return {
        userId: String(payload.userId || ''),
        email: String(payload.email || ''),
        badgeNumber: String(payload.badgeNumber || ''),
        name: String(payload.name || ''),
        rank: String(payload.rank || ''),
        department: String(payload.department || ''),
        iat: typeof payload.iat === 'number' ? payload.iat : undefined,
        exp: typeof payload.exp === 'number' ? payload.exp : undefined
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = decodeJwt(token);
    
    if (decoded && typeof decoded === 'object') {
      return {
        userId: String(decoded.userId || ''),
        email: String(decoded.email || ''),
        badgeNumber: String(decoded.badgeNumber || ''),
        name: String(decoded.name || ''),
        rank: String(decoded.rank || ''),
        department: String(decoded.department || ''),
        iat: typeof decoded.iat === 'number' ? decoded.iat : undefined,
        exp: typeof decoded.exp === 'number' ? decoded.exp : undefined
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
};

export const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('police_jwt');
};

export const setTokenInStorage = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('police_jwt', token);
};

export const removeTokenFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('police_jwt');
};