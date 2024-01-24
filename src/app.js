import express from "express";
import userRoutes from "./routes/users.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import cors from "cors";

const app = express();
app.use(cors());

//middlewares
app.use(express.json());

app.use(userRoutes);
app.use("/v1/api/auth", authenticationRoutes);

export default app;
