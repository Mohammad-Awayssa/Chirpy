import { Response, Request} from "express";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";

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

    const {hashedPassword, ...safeUser} = getUser;
    res.status(200).send(safeUser);
    

}