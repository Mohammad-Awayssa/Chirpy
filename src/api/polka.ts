import { Response, Request } from "express";
import { upgradeUser } from "../db/queries/users.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {

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
