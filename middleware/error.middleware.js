const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;

        //Mongoose bad Object
        if (err.name === "CastError") {
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        //Mongoose duplicate key
        if (err.code === 11000) {
            const message = "Duplicate field value entered";
            error = new Error(message)
            error.statusCode = 400;
        }

        if (err.name === "validationError") {
            const message = Object.values(err.valur).map((val) => val.message);
            error = new Error(message.join(","));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Server Error" });

    } catch (error) {
        next(error);
    }

}
export default errorMiddleware;