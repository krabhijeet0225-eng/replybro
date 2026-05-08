import { Router, type IRouter } from "express";
import healthRouter from "./health";
import replybro from "./replybro";
import anthropic from "./anthropic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(replybro);
router.use(anthropic);

export default router;
