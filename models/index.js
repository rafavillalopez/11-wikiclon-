const Page = require("./Page");
const User = require("./User");
const Tag = require("./Tag");

Page.belongsTo(User, { as: "author" });
Page.belongsToMany(Tag, { through: "PageTags" });
Tag.belongsToMany(Page, { through: "PageTags" });

module.exports = { Page, User, Tag };
