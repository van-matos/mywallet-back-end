import { db, objectId } from "../dbStrategy/mongo.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function userLogin (req, res) {
    const { email, password } = req.body;

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
}

export async function userSignup (req, res) {
    const user = req.body;
    const { email, password } = req.body;

    const passHash = bcrypt.hashSync(password, 10);

    try {
        const existingUser= await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.sendStatus(409);
        }

        await db.collection("users").insertOne({ ...user, password: passHash});

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function userSignout(req, res) {
    const { user } = res.locals;

    try {
       await db.collection("sessions").deleteOne({ userId: new objectId(user._id) });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}