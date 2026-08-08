import {Response, Request} from "express";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {

    const result = await createUser({email: req.body.email});

    res.status(201).send(result);
}