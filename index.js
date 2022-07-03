import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(()=> {
    db = mongoClient.db("mywallet");
});

app.post("/login", async (req, res) => {
    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { email, password } = req.body;

    const validation = loginSchema.validate(
        { email, password },
        { abortEarly: false }
    );

    if (validation.error) {
        return res.sendStatus(422);
    }

    try {
        const user = await db.collection("users").findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            const { name, email } = user;

            await db.collection("sessions").insertOne({ token, userId: user._id});

            return res.status(200).send({ name, email, token });
        } else {
            return res.status(403).send("Email e/ou senha inválidos.")
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

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

    const passHash = bcrypt.hashSync(password, 10);

    try {
        const existingUser= await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.sendStatus(409);
        }

        await db.collection("users").insertOne({ name, email, password: passHash});

        return res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.get("/balance", async (req, res) => {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        const balance = await db.collection("balance").find({ userId: new ObjectId(session.userId) }).toArray();

        res.send(balance);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.post("/income", async (req, res) => {
    const { authorization } = req.headers;
    const { amount, description, type } = req.body;

    const date = dayjs().format("DD/MM");
    const token = authorization?.replace("Bearer ", "");

    const incomeSchema = joi.object({
        amount: joi.number().required(),
        description: joi.string().required(),
        type: joi.string().valid("income").required()
    });

    const validation = incomeSchema.validate(
        { amount, description, type },
        { abortEarly: false}
    );

    if (validation.error) {
        return res.sendStatus(422);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        await db.collection("balance").insertOne({ amount, description, type, date, userId: session.userId});
        
        res.send(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.post("/expenditure", async (req, res) => {
    const { authorization } = req.headers;
    const { amount, description, type } = req.body;

    const date = dayjs().format("DD/MM");
    const token = authorization?.replace("Bearer ", "");

    const expenditureSchema = joi.object({
        amount: joi.number().required(),
        description: joi.string().required(),
        type: joi.string().valid("expenditure").required()
    });

    const validation = expenditureSchema.validate(
        { amount, description, type },
        { abortEarly: false}
    );

    if (validation.error) {
        return res.sendStatus(422);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        await db.collection("balance").insertOne({ amount, description, type, date, userId: session.userId});
        
        res.send(201);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.listen(5000, () => console.log("Server on-line."));