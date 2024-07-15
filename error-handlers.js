exports.psqlErrorHandlers = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "invalid article id" });
    } else {
        next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    console.log("CUSTOM");
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
};
