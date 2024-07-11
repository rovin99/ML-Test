import "reflect-metadata"
import { DataSource } from "typeorm"
import { Contact} from "../entity/Contact"
import dotenv from "dotenv";

dotenv.config();


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username:  process.env.DB_USERNAME,
    password:  process.env.DB_PASSWORD,
    database: "user_db",
    synchronize: true,
    logging: false,
    entities: [Contact],
    migrations: [],
    subscribers: [],
})
