import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { sendEvent } = require("../utils/producer");

const router = Router();

router.post("/api/blog", async (req, res) => {
  const blogData = req.body;
  // Save to Postgres via Prisma
  await sendEvent("student.blog", blogData);
  res.json({ status: "ok" });
});

router.post("/signup", async (req: Request, res: Response) => {
  console.log("📩 Signup request received:", req.body);
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { email, name: name ?? "", password: hash },
      select: { id: true, email: true, name: true }, // don't return password
    });

    res.status(201).json({ ok: true, message: "User created", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
