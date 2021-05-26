const S = require("sequelize");
const db = require("../db");

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
    },
    route: {
      type: S.VIRTUAL,
      get() {
        return `/wiki/${this.getDataValue("urlTitle")}`;
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

module.exports = Page;
