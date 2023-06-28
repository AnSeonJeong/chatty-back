import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("users", "password", {
      type: DataTypes.STRING(80),
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("users", "password", {
      type: DataTypes.STRING(30),
    });
  },
};
