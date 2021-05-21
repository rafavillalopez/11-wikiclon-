const router = require("express").Router()
const wikiRouter = require('./wiki');
const userRouter = require('./user');




router.use('/wiki', wikiRouter);
router.use("/", (req, res, next) => {
  res.render("index");
});


module.exports = router;