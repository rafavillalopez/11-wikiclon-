const S = require("sequelize");
const db = require(".");

class Page extends S.Model {}

Page.init(
  {
    title: {
      type: S.STRING,
      allowNull: false,
    },
    url: {
      type: S.STRING,
    },
    content: {
      type: S.STRING,
    },
    status: {
      type: S.BOOLEAN,
    },
  },
  { db, modelName: "pages" }
);

module.exports = Page;

