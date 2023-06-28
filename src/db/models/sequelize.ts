import { Sequelize } from "sequelize-typescript";
import db_config from "../../config/db_config";

const sequelize = new Sequelize({
  ...db_config,
  models: [__dirname + "/*Model.ts"],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf("Model")) === member;
  },
});

export default sequelize;
