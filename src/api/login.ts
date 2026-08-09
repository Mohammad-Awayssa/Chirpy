import { Response, Request} from "express";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken } from "../db/queries/refresh.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    const getUser = await getUserByEmail(email);

    if (!getUser) {
        res.status(401).send("Invalid email or password");
        return;
    }

    const userHashedPassword = getUser.hashedPassword;

    const checkPassword = await checkPasswordHash(password, userHashedPassword);

    if (!checkPassword) {
        res.status(401).send("Invalid email or password");
        return;
    } 


    const token = makeJWT(
        getUser.id,
        3600,
        config.jwtSecret,
    );

    const refreshToken = makeRefreshToken();

    const expiresAt = new Date(
        Date.now() + 60 * 24 *60 * 1000 // 60 days in milliseconds
    );

    await createRefreshToken(refreshToken, getUser.id, expiresAt);

    const {hashedPassword, ...safeUser} = getUser;

    res.status(200).send({...safeUser, token, refreshToken});
}