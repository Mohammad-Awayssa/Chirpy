import express,{ Request, Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";

const app = express();
const port = 8080;


app.use(middlewareLogResponses, express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.get("/admin/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});