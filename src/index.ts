import express,{ Request, Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";

const app = express();
const port = 8080;


app.use(middlewareLogResponses);
app.use("/app",express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});