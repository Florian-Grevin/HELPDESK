class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Erreur cote client' : 'error';
        this.isOperational = true;
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Ressource non trouvée') {
        super(404, message);
    }
}

class ValidationError extends ApiError {
    constructor(message = 'Données invalides') {
        super(400, message);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = 'Accès non autorisé') {
        super(401, message);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Accès interdit') {
        super(403, message);
    }
}


class ConflictError extends ApiError {
    constructor(message = 'Requête non traitable en raison de conflit avec la ressource.') {
        super(409, message);
    }
}

module.exports = { 
    ApiError, 
    NotFoundError, 
    ValidationError, 
    UnauthorizedError,
    ConflictError,
    ForbiddenError
};