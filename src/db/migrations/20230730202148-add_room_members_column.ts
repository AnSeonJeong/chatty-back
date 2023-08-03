import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("room_members", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // 현재 시간으로 설정
    });
    await queryInterface.addColumn("room_members", "updatedAt", {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // 현재 시간으로 설정
      onUpdate: "CASCADE", // 수정 시 자동으로 업데이트
    });
    await queryInterface.addColumn("room_members", "is_member", {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("room_members", "createdAt", {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn("room_members", "updatedAt");
    await queryInterface.removeColumn("room_members", "is_member");
  },
};
