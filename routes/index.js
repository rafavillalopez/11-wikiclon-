const router = require("express").Router();
const wikiRouter = require("./wiki");
const userRouter = require("./user");
const tagsRoutes = require("./tags");

router.use("/wiki", wikiRouter);
router.use("/users", userRouter);
router.use("/search", tagsRoutes);
router.use("/", wikiRouter);

module.exports = router;
