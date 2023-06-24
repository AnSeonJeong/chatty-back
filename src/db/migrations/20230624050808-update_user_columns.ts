import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await Promise.all([
      // change column
      queryInterface.changeColumn("users", "password", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("users", "intro", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("users", "profile", {
        type: DataTypes.STRING,
        allowNull: true,
      }),

      // add column
      queryInterface.addColumn("users", "type", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "social_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "nickname", {
        type: DataTypes.STRING,
        allowNull: false,
      }),

      // remove column
      queryInterface.removeColumn("users", "birth"),
      queryInterface.removeColumn("users", "name"),
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    // change column rollback
    await Promise.all([
      queryInterface.changeColumn("users", "password", {
        type: DataTypes.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("users", "intro", {
        type: DataTypes.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("users", "profile", {
        type: DataTypes.STRING,
        allowNull: false,
      }),

      // add column rollback
      queryInterface.addColumn("users", "birth", {
        type: DataTypes.DATE,
        allowNull: false,
      }),
      queryInterface.addColumn("users", "name", {
        type: DataTypes.STRING,
        allowNull: false,
      }),

      // remove column rollback
      queryInterface.removeColumn("users", "type"),
      queryInterface.removeColumn("users", "social_id"),
      queryInterface.removeColumn("users", "nickname"),
    ]);
  },
};
