import { Response, Request } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {

    const apiKey = getAPIKey(req);

    if (apiKey !== config.polkaKey) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    if (req.body.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    const userId = req.body.data.userId;
    

    const result = await upgradeUser(userId);

    if (!result) {
        res.status(404).send({ error: "User not found" });
        return;
    }

    res.status(204).send();
}
