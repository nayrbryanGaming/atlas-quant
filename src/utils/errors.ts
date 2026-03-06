// Centralized error definition to prevent leaking sensitive API/DB stack traces to user
export class AtlasError extends Error {
    constructor(message: string, public statusCode: number = 500) {
        super(message);
        this.name = 'AtlasError';
    }
}
