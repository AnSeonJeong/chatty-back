"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("room_members", {
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "rooms",
          },
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("room_members");
  },
};
