const router = require("express").Router();

// Controller
const {
  updateItem,
  getCart,
  getOrders,
  newOrder,
  getMyOrders,
} = require("./order.controller");

// Utils
const { jwtTokenPayload } = require("../../lib/jwt");
const { isAuthorized, isAdmin } = require("../../middlewares");

// Validation
const validate = require("../../lib/validation");
const POST_SCHEMA = require("../../lib/validation/schemas/items.routes/post");

// GET ../v1/orders/
router.get("/", isAdmin, async (req, res, next) => {
  try {
    // TODO: pagination

    const result = await getOrders();

    return res.status(200).json({ orders: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/orders/me
router.get("/me", isAuthorized, async (req, res, next) => {
  try {
    // TODO: pagination
    const { _id } = await jwtTokenPayload(req.cookies.token);
    const result = await getMyOrders(_id);

    return res.status(200).json({ orders: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/orders/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getCart(id);

    return res.status(200).json({ order: result[0] });
  } catch (error) {
    return next(error);
  }
});

// TODO: isAllowed middleware
// DELETE ../v1/orders/:id
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

// POST ../v1/orders/
router.post("/", isAuthorized, async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);

    // TODO: validate;
    // await validate(req.body, POST_SCHEMA);

    const result = await newOrder(req.body, _id);

    return res.status(200).json({ requester: _id, result });
  } catch (error) {
    return next(error);
  }
});

// PATCH ../v1/orders/
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
