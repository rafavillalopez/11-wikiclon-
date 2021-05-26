const { Page, Tag } = require("../models");
const Promise = require("bluebird");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    if (req.query.tag) {
      res.redirect(`/search/${req.query.tag}`);
    } else {
      res.render("taglist");
    }
  } catch (err) {
    next(err);
  }
});
router.get("/:tag", async (req, res, next) => {
  try {
    const tag = await Tag.findOne({
      where: {
        name: req.params.tag,
      },
    });
    const pages = await tag.getPages();
    res.render("listofpages", { pages, tag });
  } catch (err) {
    next(err);
  }
});

router.get("/:urlTitle/similar", async (req, res, next) => {
  try {
    const { urlTitle } = req.params;

    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });

    const tags = await page.getTags();

    let pagesForTag = await Promise.map(tags, (tag) => tag.getPages());

    const pagesIds = [];

    pagesForTag = pagesForTag.flat().forEach((pageOfTag) => {
      let id = pageOfTag.dataValues.id;

      if (!(pagesIds.includes(id) || id === page.dataValues.id))
        pagesIds.push(id);
    });

    const pages = await Promise.map(pagesIds, (id) => {
      return Page.findByPk(id);
    });

    res.render("index", { pages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
