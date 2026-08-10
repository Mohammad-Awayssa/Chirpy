import express,{ Request, Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, middlewareError } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirps,handlerAllChirps,handlerChirpId, handlerDeleteChirp } from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config, dbConfig } from "./config.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlerRevoke } from "./api/revoke.js";
import { handlerPolkaWebhook } from "./api/polka.js";

const migrationClient = postgres(config.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), dbConfig.migrationConfig);

const app = express();
const port = 8080;


app.use(middlewareLogResponses, express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.get("/admin/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerChirpId(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerChirps(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(handlerRevoke(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
    Promise.resolve(handlerPolkaWebhook(req, res)).catch(next);
});

app.put("/api/users", handlerUpdateUser);

app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});

app.use(middlewareError);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});