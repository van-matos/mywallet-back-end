import transactionSchema from "../schemas/transactionSchema.js";

export async function validateTransaction(req, res, next) {
    const validation = transactionSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.sendStatus(422);
    };

    next();
}