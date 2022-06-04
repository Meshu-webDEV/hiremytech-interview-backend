const router = require("express").Router();

// Controller
const {
  newItem,
  getItems,
  getItem,
  updateItem,
  getItemByCategory,
  getMyItems,
} = require("./item.controller");

// Utils
const { jwtTokenPayload } = require("../../lib/jwt");
const { isAuthorized, isAdmin } = require("../../middlewares");

// Validation
const validate = require("../../lib/validation");
const POST_SCHEMA = require("../../lib/validation/schemas/items.routes/post");

// GET ../v1/items/
router.get("/", async (req, res, next) => {
  try {
    // TODO: pagination

    const result = await getItems();

    return res.status(200).json({ items: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/items/me
router.get("/me", async (req, res, next) => {
  try {
    // TODO: pagination
    const { _id } = await jwtTokenPayload(req.cookies.token);
    const results = await getMyItems(_id);

    return res.status(200).json({ items: results });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/items/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getItem(id);

    return res.status(200).json({ item: result[0] });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/items/by-category/:id
router.get("/by-category/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const results = await getItemByCategory(id);

    return res.status(200).json({ items: results });
  } catch (error) {
    return next(error);
  }
});

// TODO: isAllowed middleware
// DELETE ../v1/items/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = await jwtTokenPayload(req.cookies.token);

    const result = await deleteCategory(id);

    return res.status(200).json({ requester: _id, result });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/items/
router.post("/", async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);

    // TODO: validate;
    await validate(req.body, POST_SCHEMA);

    const result = await newItem({ ...req.body, seller: _id });

    return res.status(200).json({ requester: _id, item: result });
  } catch (error) {
    return next(error);
  }
});

// PATCH ../v1/items/
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = await jwtTokenPayload(req.cookies.token);

    // TODO: validate;
    await validate(req.body, POST_SCHEMA);

    const result = await updateItem(_id, id, req.body);

    return res
      .status(200)
      .json({ requester: _id, updated: result.modifiedCount });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
