const S = require("sequelize");
const db = require("../db");

class Tag extends S.Model {}

Tag.init(
  {
    name: {
      type: S.STRING,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: "tags",
  }
);

module.exports = Tag