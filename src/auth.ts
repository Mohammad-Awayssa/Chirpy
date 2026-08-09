import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import type { JwtPayload } from "jsonwebtoken";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat,
        exp: iat + expiresIn,
    };
    
    return jwt.sign(payload, secret);
}

export function validateJWT(token: string, secret: string): string{
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || decoded.sub === undefined) {
        throw new Error("Invalid token");
    }

    return decoded.sub;
    
}