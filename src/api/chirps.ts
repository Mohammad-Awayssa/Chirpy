import {Response, Request} from "express";
import { BadRequestError } from "../app/error.js";
import { createChirp, getAllChirps, getChirpsById, deleteChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerChirps(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwtSecret);

    const content = req.body;
    
    
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

    
    const chirp = await createChirp({body: content.body, userId});

    res.status(201).send(chirp);
}

export async function handlerAllChirps(req: Request, res: Response) {
    const authorIdQuery = req.query.authorId;

    let authorId = "";
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    const chirps = await getAllChirps(authorId);
    res.status(200).send(chirps);
}

export async function handlerChirpId(req: Request, res: Response) {

    const chirpId = req.params.chirpId;
    if(typeof chirpId === "string"){
        const chirps = await getChirpsById(chirpId);
        if (!chirps) {
            res.status(404).send({ error: "Chirp not found" });
            return;
        }
        res.status(200).send(chirps);
    }
    else {
        res.status(400).send({ error: "Invalid chirpId" });
    }
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwtSecret);

    const chirpId = req.params.chirpId;

    if (typeof chirpId !== "string") {
        res.status(400).send({ error: "Invalid chirpId" });
        return;
    }

    const chirp = await getChirpsById(chirpId);
        
    if (!chirp) {
        res.status(404).send({ error: "Chirp not found" });
        return;
    }
        
    if (chirp.userId !== userId) {
        res.status(403).send({ error: "Forbidden" });
        return;
    }

    await deleteChirp(chirpId);
    res.status(204).send();
    
}
