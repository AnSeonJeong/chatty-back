import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("users", "social_id", {
      type: DataTypes.STRING(50),
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("users", "social_id", {
      type: DataTypes.STRING(30),
    });
  },
};
