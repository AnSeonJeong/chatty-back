import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("room_members", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.changeColumn("chatting", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.changeColumn("rooms", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
    await queryInterface.changeColumn("rooms", "updatedAt", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("room_members", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("chatting", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("rooms", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("rooms", "updatedAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
  },
};
