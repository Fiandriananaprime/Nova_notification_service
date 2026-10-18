import { AppError } from "./AppError.js";

export class RessourcesNotFoundError extends AppError {
    constructor(message?: string) {
        super(
            "RESSOURCES_NOT_FOUND",
            404,
            message || "Ressources Not Found"
        );
    }
}