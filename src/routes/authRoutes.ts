import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
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

    res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

export default router;
