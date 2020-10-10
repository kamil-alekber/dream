import express from "express";
import cookieParser from "cookie-parser";
import { AppRoutes } from "./routes";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { checkEnv } from "./helpers/checkEnv";
import favicon from "serve-favicon";
const app = express();
checkEnv(app);

// app.set('trust proxy', 1);
// Disable `powered-by` and add other protections
// https://www.npmjs.com/package/helmet
// app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.set("views", path.resolve(__dirname, "public", "views"));
app.set("view engine", "ejs");
app.use(helmet());

const whitelist =
  process.env.NODE_ENV === "prod"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5000",
      ];
      
app.use(
  cors({
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Cookie",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "HEAD", "POST", "OPTIONS"],
    origin: (origin: string | undefined, callback: any) => {
      if (
        whitelist.includes(`${origin}`) ||
        typeof origin === "undefined" ||
        origin === "null"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

app.use(AppRoutes);

// app.all("*", async (req, res, next) => {
//   const err = new GlobalError(
//     `${req.originalUrl} does not exist on the server`,
//     404
//   );
//   next(err);
// });
// app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.warn(
    "\x1b[32m%s\x1b[0m",
    "[+] 🚀 Sever is listening on:",
    `http://localhost:${port}`
  );
});
