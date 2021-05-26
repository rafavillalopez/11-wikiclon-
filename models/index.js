const Page = require("./Page");
const User = require("./User");
const Tag = require("./Tag");

Page.belongsTo(User, { as: "author" });

Page.belongsToMany(Tag, { through: "pagestags" });
Tag.belongsToMany(Page, { through: "pagestags" });

module.exports = { Page, User, Tag };
