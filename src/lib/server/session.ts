import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

const key = Buffer.from(process.env.SESSION_SIGNING_KEY || "", "hex");
if (key.length !== 32) throw new Error("SESSION_SIGNING_KEY must be 32 bytes");
const aud = process.env.EXEC_ENV;

export const createSession = (claims: {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number; // Preserved if passed, set to now if not.
}): string => {
  const now = Math.floor(new Date().getTime() / 1000);
  return jwt.sign(
    {
      iss: "SvelteState",
      aud: aud,
      iat: claims.iat || now,
      nbf: now,
      // Expiry is lesser of 4 hours from now, or 12 hours from successful auth
      exp: Math.min(now + 14400, (claims.iat || now) + 43200),
      sub: claims.sub,
      name: claims.name,
      email: claims.name,
      role: claims.role,
    },
    key,
    { algorithm: "HS256", noTimestamp: true },
  );
};

export const validateAndRefreshSession = (
  token: string,
): {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  newSession?: string;
} => {
  try {
    const decoded = jwt.verify(token, key, {
      algorithms: ["HS256"],
      audience: aud,
    });
    // Need to force-deal with all of these optionals
    // prettier-ignore
    // @ts-expect-error JWT has no rich type data
    const newSession = createSession({ sub: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role, iat: decoded.iat, });
    return {
      success: true,
      user: {
        id: Number(decoded.sub),
        /// @ts-expect-error JWT has no rich type data
        name: decoded.name,
        // @ts-expect-error JWT has no rich type data
        email: decoded.email,
        // @ts-expect-error JWT has no rich type data
        role: decoded.role,
      },
      newSession: newSession,
    };
  } catch (error) {
    return { success: false };
  }
};
