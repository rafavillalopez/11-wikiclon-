const { Page, User, Tag, PageTags } = require("../models");

const router = require("express").Router();

router.get("/:tag", async (req, res, next) => {
  const tag = await Tag.findOne({
    where: {
      name: req.params.tag,
    },
  });
  const pages = await tag.getPages();
});

router.post("/:url", async (req, res, next) => {
  try {
    const tags = req.body.tags.split(" ");
    const tagsArr = tags.map((tag) => {
      Tag.findOrCreate({
        where: {
          name: tag,
        },
      });
    });

    const adedTags = await Promise.all(tagsArr);

    const page = await Page.findOne({
      where: {
        urlTitle: req.params.url,
      },
    });

    const aded = await page.addTag(adedTags[0])
    console.log(aded)
    /* const tagsToPage = adedTags.map((tag) => {
      page.addTag(tag);
    });

    await Promise.all(tagsToPage); */

    res.redirect(page.route);

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
