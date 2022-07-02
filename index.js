import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

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

app.post("/signup", async (req, res) => {
    const signupSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        passConfirm: joi.string().required()
    });

    const { name, email, password, passConfirm } = req.body;

    const validation = signupSchema.validate(
        { name, email, password, passConfirm },
        { abortEarly: false }
    );

    if (validation.error) {
        return res.sendStatus(422);
    }

    if (password !== passConfirm) {
        return res.sendStatus(403);
    }

    try {
        const existingUser= await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.sendStatus(409);
        }

        await db.collection("users").insertOne({ name, email, password});

        return res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.get("/balance", async (req, res) => {});
app.post("/income", async (req, res) => {});
app.post("/expenditure", async (req, res) => {});

app.listen(5000, () => console.log("Server on-line."));