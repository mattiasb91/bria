import express from "express";
import cors from "cors";
import router from "./router.js"; // <-- note the .js extension for NodeNext/ESM

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT} 📚`);
});
