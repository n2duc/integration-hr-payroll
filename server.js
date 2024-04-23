import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import db from './src/config.db.js';

import routes from "./src/routes/index.js"

const PORT = process.env.PORT || 8181;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routes);

// db.sqlServer.authenticate().then(() => {
//   console.log('Connection has been established successfully - SQLServer.');
// }).catch((error) => {
//   console.error('Unable to connect to the database: ', error);
// })

// db.mySQL.authenticate().then(() => {
//   console.log('Connection has been established successfully - MySQL.');
// }).catch((error) => {
//   console.error('Unable to connect to the database: ', error);
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
});