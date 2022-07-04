import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { userLogin, userSignup, userSignout } from "./controllers/authController.js";
import { listBalance, newExpenditure, newIncome } from "./controllers/transactionController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", userLogin);

app.post("/signup", userSignout);

app.get("/balance", listBalance);

app.post("/income", newIncome);

app.post("/expenditure", newExpenditure);

app.get("/signout", userSignup);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server on-line."));