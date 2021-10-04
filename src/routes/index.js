import { Router } from "express";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
import notesRouter from "./notes.route";
import categoryRouter from "./category.route";
import roleRouter from "./role.route";
import eventRouter from "./events.route";
import interestRouter from "./interests.route";
import analyticsRouter from "./analytics.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/notes", notesRouter);
router.use("/categories", categoryRouter);
router.use("/roles", roleRouter);
router.use("/events", eventRouter);
router.use("/interests", interestRouter);
router.use("/analytics", analyticsRouter);

export default router;
