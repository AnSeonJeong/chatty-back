"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("chatting", {
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
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      file: {
        type: DataTypes.STRING,
      },
      text: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("chatting");
  },
};
