import {Response, Request} from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const hashedPas = await hashPassword(req.body.password);

    const result = await createUser({hashedPassword: hashedPas, email: req.body.email});

    const {hashedPassword, ...safeResult} = result;

    res.status(201).send(safeResult);
}