import { Router } from "express";
import { listBalance, newExpenditure, newIncome } from "../controllers/transactionController.js";

const router = Router();

router.get("/balance", listBalance);
router.post("/income", newIncome);
router.post("/expenditure", newExpenditure);

export default router;