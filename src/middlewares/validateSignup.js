import signupSchema from "../schemas/signupSchema.js";

export async function validateSignup(req, res, next) {
    const validation = signupSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.sendStatus(422);
    };

    next();
}