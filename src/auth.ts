import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { randomBytes } from "crypto";
import { UnauthorizedError } from "./app/error.js";

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
    try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || decoded.sub === undefined) {
        throw new UnauthorizedError("Invalid token");
    }

    return decoded.sub;
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            throw err;
        }

        throw new UnauthorizedError("Invalid token");
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader){
        throw new UnauthorizedError("Missing Authorization header");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new UnauthorizedError("Missing or invalid Authorization header");
    }
    return parts[1];
}

export function makeRefreshToken(): string {
    return randomBytes(32).toString("hex");
}