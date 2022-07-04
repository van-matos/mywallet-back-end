import { db, objectId } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";

export async function newIncome(req, res) {
    const { amount, description, type } = req.body;
    const { user } = res.locals;

    const date = dayjs().format("DD/MM");

    try {
        await db.collection("balance").insertOne({ amount, description, type, date, userId: new objectId(user._id)});
        
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function newExpenditure(req, res) {
    const { amount, description, type } = req.body;
    const { user } = res.locals;

    const date = dayjs().format("DD/MM");
    
    try {
        await db.collection("balance").insertOne({ amount, description, type, date, userId: new objectId(user._id)});
        
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function listBalance(req, res) {
    const { user } = res.locals;

    try {
        const balance = await db.collection("balance").find({ userId: new objectId(user._id) }).toArray();

        res.send(balance);
    } catch (error) {
        res.sendStatus(500);
    }
}