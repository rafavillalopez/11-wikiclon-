const { Page, User, Tag, PageTags } = require("../models");
const Promise = require("bluebird");

const router = require("express").Router();

router.get("/:tag", async (req, res, next) => {
  const tag = await Tag.findOne({
    where: {
      name: req.params.tag,
    },
  });
  const pages = await tag.getPages();
  
  res.render("taglist", { pages, tag });
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

module.exports = router;
