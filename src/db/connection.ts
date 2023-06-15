import { Sequelize } from "sequelize-typescript";
import db_config from "../config/db_config";

const sequelize = new Sequelize(db_config);

sequelize.addModels([__dirname + "/models"]);

export default sequelize;
