import {Response, Request} from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            if (body.length > 140){
                res.header("Content-Type", "application/json; charset=utf-8");
                res.status(400).send(JSON.stringify({error: "Chirp is too long"}));
            }
            else {
                res.header("Content-Type", "application/json; charset=utf-8"); 
                res.status(200).send(JSON.stringify({valid: true}));

            }
        } catch (error) {
            res.header("Content-Type", "application/json; charset=utf-8");
            res.status(500).send(JSON.stringify({error: "Something went wrong"}));
        }

    });
}
            
