class ApiError extends Error {
    constructor(status, massage) {
        super();
        this.status = status;
        this.massage = massage;
    }

    static badRequest(massage) {
        return new ApiError(404, massage);
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static forbidden(message) {
        return new ApiError(403, message);
    }
}

module.exports = ApiError