import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from 'path';
import { User } from "./entities/User";
const dotenv = require("dotenv");

dotenv.config();

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: "mycruddb",
    password: process.env.PASSWORD,
    user: "postgres",
    type: "postgresql",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];