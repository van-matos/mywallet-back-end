import { db } from "../dbStrategy/mongo.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import loginSchema from "../schemas/loginSchema.js";
import signupSchema from "../schemas/signupSchema.js";

export async function userLogin (req, res) {
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
}

export async function userSignup (req, res) {
    const { name, email, password } = req.body;

    const validation = signupSchema.validate(
        { name, email, password },
        { abortEarly: false }
    );

    if (validation.error) {
        return res.sendStatus(422);
    }

    const passHash = bcrypt.hashSync(password, 10);

    try {
        const existingUser= await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.sendStatus(409);
        }

        await db.collection("users").insertOne({ name, email, password: passHash});

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function userSignout(req, res) {
    const { authorization } = req.headers;
    
    const token = authorization?.replace("Bearer ", "");

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        await db.collection("sessions").deleteOne({ token });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}