import { DataSource } from "typeorm";
const ormconfig = require("../../ormconfig");

console.log(process.env.NODE_ENV);
console.log(ormconfig);

/**
 * THIS SETTING JUST FOR "TypeORM MIGRATION" NOT FOR NEST JS CONNECTION
 */
export const AppDataSource = new DataSource({...ormconfig})