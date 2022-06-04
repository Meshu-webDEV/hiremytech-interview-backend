const router = require("express").Router();

// Controller
const {
  getAuthorities,
  getAuthority,
  newAuthority,
} = require("./authority.controller");

// Utils
const { jwtTokenPayload } = require("../../lib/jwt");
const { WEB_SERVER } = require("../../lib/configs");

// Validation
const validate = require("../../lib/validation");
const POST_SCHEMA = require("../../lib/validation/schemas/authority.routes/post");

// GET ../v1/authorities/
router.get("/", async (req, res, next) => {
  try {
    const result = await getAuthorities();

    return res.status(200).json({ authorities: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/authorities/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = await jwtTokenPayload(req.cookies.token);

    const result = await getAuthority(id);

    return res.status(200).json({ requester: _id, authority: result });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/authorities/
router.post("/", async (req, res, next) => {
  try {
    // Validate
    await validate(req.body, POST_SCHEMA);

    const result = await newAuthority(req.body);

    return res.status(200).json({ requester: _id, authority: result });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
