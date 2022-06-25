import {Router} from "express";
import authRouter from "./auth.route.js";
import usersRouter from "./users.route.js";
import notesRouter from "./notes.route.js";
import categoryRouter from "./category.route.js";
import roleRouter from "./role.route.js";
import eventRouter from "./events.route.js";
import interestRouter from "./interests.route.js";
import analyticsRouter from "./analytics.route.js";

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
