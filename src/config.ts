import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

type APIConfig = {
    fileserverHits: number;
    dbURL: string;
    platform: string;
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
    platform: envOrThrow("PLATFORM"),
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
}

type DBConfig = {
    dbURL: string;
    migrationConfig: MigrationConfig;
}

export const dbConfig: DBConfig = {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig,
};