import { db } from "../dbStrategy/mongo.js";

export async function validateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }

        const user = await db.collection("users").findOne({ _id: session.userId });

        if (!session) {
            return res.sendStatus(401);
        }

        res.locals.user = user;
        next();
    } catch (error) {
        res.sendStatus(500);
    }
}