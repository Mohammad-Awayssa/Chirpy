import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.platform !== "dev") {
        res.status(403).send("Reset is only allowed in dev mode");
        return;
    }
    config.fileserverHits = 0;
    await deleteAllUsers();
    res.send("Metrics reset successfully");
}