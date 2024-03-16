import express from "express";
import router from "./routers/Routes.js";
import dotenv from "dotenv";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import db from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  checkExpirationInterval: 1 * 60 * 1000,
  expiration: 1 * 60 * 60 * 1000,
});

const app = express();
const port = process.env.PORT;

//middleware
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static(path.join(__dirname, "uploads")));
app.use(router);
app.use(errorHandler);

// db.sync()
// database checked
// try {
//   await db.authenticate();
//   console.log("connection established successfully");
// } catch (error) {
//   console.error("unable to connect to database");
// };
// store.sync(); //sync with store session
app.listen(port, console.log("Server started http://localhost:" + port));
