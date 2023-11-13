import { DataSource, DataSourceOptions } from "typeorm";
import {config} from "dotenv";

config();

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: `${process.env.MYSQL_HOST}`,
    port: Number.parseInt(`${process.env.MYSQL_PORT}`),
    username: `${process.env.MYSQL_USERNAME}`,
    password: `${process.env.MYSQL_PASSWORD}`,
    database: `${process.env.MYSQL_DATABASE}`,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize:JSON.parse(`${process.env.MYSQL_SYNCHRONIZE}`)
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;