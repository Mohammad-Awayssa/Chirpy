import { Response, Request } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { getUserFromRefreshToken } from "../db/queries/refresh.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);

    const tokenData = await getUserFromRefreshToken(refreshToken);

    if (!tokenData) {
        res.status(401).send("Invalid refresh token");
        return;
    }

    if (tokenData.revokedAt !== null) {
        res.status(401).send("Refresh token has been revoked");
        return;
    }

    if (tokenData.expiresAt < new Date()) {
        res.status(401).send("Refresh token has expired");
        return;
    }

    const token = makeJWT(
        tokenData.userId,
        3600,
        config.jwtSecret,
    );

    res.status(200).send({ token });
}