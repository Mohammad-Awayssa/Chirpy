import { Request, Response } from "express";
import { config } from "../config.js";
import { users } from "../db/schema.js";
import { db } from "../db/index.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.platform !== "dev") {
        res.status(403).send("Reset is only allowed in dev mode");
        return;
    }
    config.fileserverHits = 0;
    await db.delete(users).execute();
    res.send("Metrics reset successfully");
}