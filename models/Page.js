const S = require("sequelize");
const db = require("../db");
const marked = require("marked");
const Tag = require("./Tag");

class Page extends S.Model {}

Page.init(
  {
    title: {
      type: S.STRING,
      allowNull: false,
    },
    urlTitle: {
      type: S.STRING,
      allowNull: false,
    },
    content: {
      type: S.TEXT,
      allowNull: false,
    },
    status: {
      type: S.ENUM("open", "closed"),
      validate: {
        isIn: {
          args: [["open", "closed"]],
        },
      },
    },
    route: {
      type: S.VIRTUAL,
      get() {
        return `/wiki/${this.getDataValue("urlTitle")}`;
      },
    },
    renderedContent: {
      type: S.VIRTUAL,
      get() {
        return marked(this.getDataValue("content"));
      },
    },
  },
  {
    sequelize: db,
    modelName: "page",
  }
);

// Creating a url
function generateUrlTitle(title) {
  if (title) {
    return title.replace(/\s+/g, "_").replace(/\W/g, "");
  } else {
    return Math.random().toString(36).substring(2, 7);
  }
}

Page.addHook("beforeValidate", (page, options) => {
  const url = generateUrlTitle(page.title);
  page.urlTitle = url;
});

Page.findByTag = async function (name) {
  let tag = await Tag.findOne({ where: { name } });
  if (tag) {
    let page = await tag.getPages();
    return page;
  } else return [];
};

Page.prototype.findSimilar = async function () {
  const tags = await this.getTags();

  let pagesForTag = await Promise.all(
    tags.map((tag) => {
      return tag.getPages();
    })
  );
  const pagesIds = [];
  pagesForTag = pagesForTag.flat().forEach((pageOfTag) => {
    let id = pageOfTag.dataValues.id;

    if (!(pagesIds.includes(id) || id === this.dataValues.id))
      pagesIds.push(id);
  });
  return await Promise.all(
    pagesIds.map((id) => {
      return Page.findByPk(id);
    })
  );
};

module.exports = Page;
