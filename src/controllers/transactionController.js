import { db, objectId } from "../dbStrategy/mongo.js";
import joi from "joi";
import dayjs from "dayjs";

export async function newIncome(req, res) {
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
        
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function newExpenditure(req, res) {
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
        
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function listBalance(req, res) {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        const balance = await db.collection("balance").find({ userId: new objectId(session.userId) }).toArray();

        res.send(balance);
    } catch (error) {
        res.sendStatus(500);
    }
}