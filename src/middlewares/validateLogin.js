import loginSchema from "../schemas/loginSchema.js";

export async function validateLogin(req, res, next) {
    const validation = loginSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.sendStatus(422);
    };

    next();
}