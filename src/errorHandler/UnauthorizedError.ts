import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
    constructor(message?: string) {
        super(
            "UNAUTHORIZED",
            401,
            message ||"User Unauthorized"
        );
    }
}