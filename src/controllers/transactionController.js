import { db, objectId } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";

import transactionSchema from "../schemas/transactionSchema.js";

export async function newIncome(req, res) {
    const { authorization } = req.headers;
    const { amount, description, type } = req.body;

    const date = dayjs().format("DD/MM");
    const token = authorization?.replace("Bearer ", "");

    const validation = transactionSchema.validate(
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

    const validation = transactionSchema.validate(
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