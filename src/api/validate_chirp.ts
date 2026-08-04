import {Response, Request} from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    type resBody = {
        body: string,
    }
    const content: resBody = req.body;

    if (content.body.length > 140){
        res.status(400).send({"error": "Chirp is too long"});
        return; 
    }

    const words = content.body.split(" ");

    const badwords = ["kerfuffle", "sharbert", "fornax"]
    for (let i =0; i< words.length; i++){
        const word = words[i];
        const lower = word.toLowerCase();
        if (badwords.includes(lower)){
            words[i] = "****";
            }
        }

    content.body = words.join(" ");

    res.status(200).send({cleanedBody: content.body});

}
            
