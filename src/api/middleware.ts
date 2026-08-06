import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError } from "../app/error.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if(res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
};

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    
    next();
}

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    }
    if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }
    if (err instanceof ForbiddenError) {
        statusCode = 403;
        message = err.message;
    }
    if (err instanceof UnauthorizedError) {
        statusCode = 401;
        message = err.message;
    }
    
    if(statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({ error: message });
}
