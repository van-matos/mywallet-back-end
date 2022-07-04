import { Router } from "express";
import { listBalance, newExpenditure, newIncome } from "../controllers/transactionController.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateTransaction } from "../middlewares/validateTransaction.js";

const router = Router();

router.get("/balance", validateToken, listBalance);
router.post("/income", validateToken, validateTransaction, newIncome);
router.post("/expenditure", validateToken, validateTransaction, newExpenditure);

export default router;