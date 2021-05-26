const { Page, User, Tag } = require("../models");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.render("index", { pages });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, title, content, status, tags } = req.body;
  try {
    const userArrP = User.findOrCreate({
      where: {
        firstName: name,
        email,
      },
    });

    const pageP = Page.create({
      title,
      content,
      status,
    });

    let tagsAded = await Promise.all(
      tags.split(" ").map((tagName) => {
        return Tag.findOrCreate({
          where: {
            name: tagName,
          },
        });
      })
    );
    tagsAded = tagsAded.map((tagBool) => tagBool[0]);

    const [page, user] = await Promise.all([pageP, userArrP]);

    await Promise.all([page.setAuthor(user[0]), page.addTags(tagsAded)]);

    res.redirect(page.route);
  } catch (err) {
    next(err);
  }
});

router.get("/add", (req, res, next) => {
  res.render("addpage");
});

router.get("/:urlTitle", async (req, res, next) => {
  const { urlTitle } = req.params;
  try {
    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });
    if (page) {
      const [user, tags] = await Promise.all([
        page.getAuthor(),
        page.getTags(),
      ]);
      res.render("wikipage", { page, user, tags });
    } else {
      throw new TypeError(404 + " Not Found");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:urlTitle/edit", async (req, res, next) => {
  try {
    const { urlTitle } = req.params;
    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });
    let tags = await page.getTags();
    tags = tags.map((tag) => tag.dataValues.name).join(" ");

    res.render("editpage", { page, tags });
  } catch (err) {
    next(err);
  }
});

router.post("/:urlTitle/edit", async (req, res, next) => {
  try {
    const { urlTitle } = req.params;
    const { tags } = req.body;
    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });

    for (let key in req.body) {
      if ([key] !== "tags") page[key] = req.body[key];
    }

    let tagsAded = await Promise.all(
      tags.split(" ").map((name) => {
        return Tag.findOrCreate({
          where: {
            name,
          },
        });
      })
    );

    tagsAded = tagsAded.map((tagBool) => tagBool[0]);

    await page.setTags(tagsAded);

    await page.save();

    // De esta manera mantiene el mismo urlTitle aunque se haya cambiado el titulo
    const savedPage = await page.reload();

    res.redirect(savedPage.route);
  } catch (err) {
    next(err);
  }
});

router.get("/:urlTitle/delete", async (req, res, next) => {
  try {
    const { urlTitle } = req.params;
    await Page.destroy({
      where: {
        urlTitle,
      },
    });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
