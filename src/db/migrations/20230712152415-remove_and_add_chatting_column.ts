import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("chatting", "file");
    await queryInterface.addColumn("chatting", "originalDocName", {
      type: DataTypes.STRING(100),
    });
    await queryInterface.addColumn("chatting", "document", {
      type: DataTypes.STRING(200),
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("chatting", "file", {
      type: DataTypes.STRING(200),
    });
    await queryInterface.removeColumn("chatting", "originalDocName");
    await queryInterface.removeColumn("chatting", "document");
  },
};
