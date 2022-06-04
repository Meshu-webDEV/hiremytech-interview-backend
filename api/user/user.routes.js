const router = require("express").Router();

// Controller
const { signUp, signIn, getUsers, getMe } = require("./user.controller");

// Utils
const { jwtTokenPayload } = require("../../lib/jwt");
const { isAuthorized, isAdmin } = require("../../middlewares");
const { WEB_SERVER } = require("../../lib/configs");

// Validation
const validate = require("../../lib/validation");
const signinSchema = require("../../lib/validation/schemas/user.routes/post.signin");
const signupSchema = require("../../lib/validation/schemas/user.routes/post.signup");

// GET ../v1/users/
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);

    const result = await getUsers(_id);

    return res.status(200).json({ requester: _id, users: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/users/
router.get("/me", isAuthorized, async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);
    const me = await getMe(_id);

    return res.status(200).json(me);
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signin
router.post("/signin", async (req, res, next) => {
  try {
    // Validate
    await validate(req.body, signinSchema);

    const { username, id, token } = await signIn(req.body);
    return res
      .status(200)
      .cookie("token", token, {
        secure: WEB_SERVER.ENV === "production" ? true : false,
        httpOnly: WEB_SERVER.ENV === "production" ? true : false,
        sameSite: "none", //on production
        maxAge: 1000 * 60 * 60 * 24 * 14, // Two Weeks
      })
      .json({ username, id, token });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signup
router.post("/signup", async (req, res, next) => {
  try {
    // Validate
    await validate(req.body, signupSchema);
    const { username, id, token } = await signUp(req.body, req);

    return res
      .status(201)
      .cookie("token", token, {
        secure: WEB_SERVER.ENV === "production" ? true : false,
        httpOnly: WEB_SERVER.ENV === "production" ? true : false,
        sameSite: "none", //on production
        maxAge: 1000 * 60 * 60 * 24 * 14, // Two Weeks
      })
      .json({ username, id });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signup
router.get("/signout", async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ status: 1, message: "Successfully signed out." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
