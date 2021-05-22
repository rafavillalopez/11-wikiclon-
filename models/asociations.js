const { User, Page, Tag } = require(".");

Page.belongsTo(User, { as: "author" });

Page.belongsToMany(Tag, { through: "pagestags" });
Tag.belongsToMany(Page, { through: "pagestags" });
