import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "banana";

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);

    res.status(200).json({
      message: "Login bem-sucedido",
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

export default router;
