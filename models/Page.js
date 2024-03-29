const Sequelize = require("sequelize");
const db = require("../db");
const { options } = require("./User");

class Page extends Sequelize.Model {}

Page.init(
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    urlTitle: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("open", "closed"),
    },
    route: {
      type: Sequelize.VIRTUAL,
      get() {
        return `/wiki/${this.getDataValue(this.urlTitle)}`;
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

Page.addHook("beforeValidate", (page, options)=>{
  page.urlTitle = generateUrlTitle(page.title)
})

module.exports = Page;
