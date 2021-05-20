const router = require("express").Router()

router.get("/", (req, res, next) => {
    res.render("index", {hola:"el pepe"})
})

module.exports = router