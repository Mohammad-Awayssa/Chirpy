import {Response, Request} from "express";
import { BadRequestError } from "../app/error.js";
import { createChirp, getAllChirps } from "../db/queries/chirps.js";

export async function handlerChirps(req: Request, res: Response) {
    type resBody = {
        body: string,
        userId : string,
    }
    const content: resBody = req.body;
    
    
    if (content.body.length > 140){
        throw new BadRequestError("Chirp is too long. Max length is 140");
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

    
    const chirp = await createChirp(content);

    res.status(201).send(chirp);
}

export async function handlerAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    res.status(200).send(chirps);
}
            
