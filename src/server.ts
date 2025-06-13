import dotenv from "dotenv";
import express, { Application } from "express";
import router from "./routes/authRoutes";
import mongoose from "mongoose";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/api/v1/", router);

mongoose
  .connect(process.env.MONGODB_URI as string, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    retryWrites: true,
    appName: "Cluster0",
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro de conexão:", error));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
