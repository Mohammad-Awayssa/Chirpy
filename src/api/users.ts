import {Response, Request} from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const hashedPas = await hashPassword(req.body.password);

    const result = await createUser({hashedPassword: hashedPas, email: req.body.email});

    const {hashedPassword, ...safeResult} = result;

    res.status(201).send(safeResult);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    const token = getBearerToken(req);

    try {
        const userId = validateJWT(token, config.jwtSecret);
        const hashedPas = await hashPassword(req.body.password);

        const result = await updateUser(userId, req.body.email, hashedPas);

        const {hashedPassword, ...safeResult} = result;

        res.status(200).send(safeResult);
    } catch (err) {
        res.status(401).send({error: "Unauthorized"});
    }
}