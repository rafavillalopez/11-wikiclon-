const { Page, User, Tag } = require("../models");
const Promise = require("bluebird");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.render("taglist", { tags });
  } catch (err) {
    next(err);
  }
});
router.get("/:tag", async (req, res, next) => {
  const tag = await Tag.findOne({
    where: {
      name: req.params.tag,
    },
  });
  const pages = await tag.getPages();

  res.render("listofpages", { pages, tag });
});

router.post("/:urlTitle", async (req, res, next) => {
  const { urlTitle } = req.params;
  try {
    const tags = req.body.tags.split(" ");

    let tagsAded = await Promise.map(tags, (name) => {
      return Tag.findOrCreate({
        where: {
          name,
        },
      });
    });

    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });
    tagsAded = tagsAded.map((tagBool) => tagBool[0]);

    await page.addTags(tagsAded);

    res.redirect(page.route);
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

    let pagesIds = [];

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
