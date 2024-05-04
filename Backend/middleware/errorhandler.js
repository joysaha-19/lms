const { constants } = require("../constants");
const errorhandler = (err, req, res, next) => {
  const statuscode = res.statusCode ? res.statusCode : 500; 
  switch (statuscode) {
    case constants.validation_error:
      res.json({
        title: "Validation error",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case constants.forbidden:
      res.json({
        title: "forbidden_error",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case constants.not_found:
      res.json({
        title: "Not found",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case constants.unauthorized:
      res.json({
        title: "unauthorized",
        message: err.message,
        stacktrace: err.stack,
      });
    default:
      console.log("No error. All good");
  }
  next(err);
};
module.exports = errorhandler;
