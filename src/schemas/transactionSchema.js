import joi from "joi";

const transactionSchema = joi.object({
    amount: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().valid("expenditure", "income").required()
});

export default transactionSchema;