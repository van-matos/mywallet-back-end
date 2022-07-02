import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(()=> {
    db = mongoClient.db("mywallet");
});

app.post("/login", async (req, res) => {});

app.post("/signup", async (req, res) => {});

app.get("/balance", async (req, res) => {});

app.post("/income", async (req, res) => {});

app.post("/expenditure", async (req, res) => {});

app.listen(5000, () => console.log("Server on-line."))

