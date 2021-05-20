const Sequelize = require("sequelize");
const db = require("../db");

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
                return `/wiki/${this.getDataValue(urlTitle)}`;
            },
        },
    },
    {
        sequelize: db,
        modelName: "page",
    }
);

module.exports = Page;
