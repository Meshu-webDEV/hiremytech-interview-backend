/**
 * @type {import('mongoose').Model}
 */
const User = require("./api/user/user.model");
/**
 * @type {import('mongoose').Model}
 */
const Authority = require("./api/authority/authority.model");

// Utils
const ERRORS = require("./lib/errors");
const { jwtVerify } = require("./lib/jwt");

function databaseStatus(req, res, next) {
  if (
    typeof req.app.settings.database === "undefined" ||
    !req.app.settings.database
  )
    return next(ERRORS.INTERNAL);

  return next();
}

function notFound(req, res, next) {
  next(ERRORS.NOT_FOUND);
}

function errorHandler(error, req, res, next) {
  console.log(error);

  return res.status(error.code).json({
    status: error.code,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "📚" : error.stack,
    errors: error?.errors ? error?.errors : null,
  });
}

async function isAuthorized(req, res, next) {
  // check token in the headers
  try {
    const { token } = req.cookies;

    const id = await jwtVerify(token);

    // Find user
    await User.findOne({ _id: id, isDeleted: false });

    return next();
  } catch (error) {
    return next(ERRORS.UNAUTHORIZED);
  }
}

async function isAdmin(req, res, next) {
  // check token in the headers

  try {
    const { token } = req.cookies;

    const id = await jwtVerify(token);

    // Find user
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) return next(ERRORS.UNAUTHORIZED);

    const privilege = await Authority.findOne({ _id: user.authority });

    if (parseInt(privilege.authority) !== 1) return next(ERRORS.UNAUTHORIZED);

    return next();
  } catch (error) {
    return next(ERRORS.UNAUTHORIZED);
  }
}

module.exports = {
  databaseStatus,
  notFound,
  errorHandler,
  isAuthorized,
  isAdmin,
};
