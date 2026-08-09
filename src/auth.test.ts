import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "./auth.js";
import { Request } from "express";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });

  it("should return false for a completely different password", async () => {
    const result = await checkPasswordHash("completelyDifferentPassword!", hash1);
    expect(result).toBe(false);
  });
});

describe("JWT Generation and Validation", () => {
    const userID = "user123";
    const secret = "superSecret";
    const expiresIn = 60; // 1 minute

    it("should generate a valid JWT and validate it correctly", () => {
        const token = makeJWT(userID, expiresIn, secret);
        const result = validateJWT(token, secret);
        expect(result).toBe(userID);
    });

    it("should throw an error for an invalid JWT", () => {
        const token = makeJWT(userID, -1, secret); 

        expect(() => validateJWT(token, secret)).toThrow();
    });

    it("should reject a JWT signed with a wrong secret", () => {
        const token = makeJWT(userID, expiresIn, secret);
        expect(() => validateJWT(token, "wrongSecret")).toThrow();
    });

});

describe("getBearerToken function", () => {

    it("should extract the token from a valid Authorization header", () => {
        const req = {
            get: () => "Bearer testToken123"
        }as unknown as Request;

        const token = getBearerToken(req);
        expect(token).toBe("testToken123");
    });

    it("should throw an error if the Authorization header is missing", () => {
        const req = {
            get: () => undefined
        }as unknown as Request;
        expect(() => getBearerToken(req)).toThrow("Missing Authorization header");
    });
});

describe("refresh token generation", () => {
    it("should generate a refresh token of 64 characters", () => {
        const token = makeRefreshToken();
        expect(token).toHaveLength(64);
    });

    it("should generate unique refresh tokens", () => {
        const token1 = makeRefreshToken();
        const token2 = makeRefreshToken();
        expect(token1).not.toBe(token2);
    });
});