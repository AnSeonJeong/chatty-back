import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      social_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      intro: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      profile: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 현재 시간으로 설정
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 현재 시간으로 설정
        onUpdate: "CASCADE", // 수정 시 자동으로 업데이트
      },
      del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users");
  },
};
