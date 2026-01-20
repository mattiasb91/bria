import  app from "./app.js";
// import express from "express";
// import cors from "cors";
// import router from "./router.js";
import { connectDB } from "./db.js";
//const app = express();
const PORT = 3000;

// app.use(cors());
// app.use(express.json());
// app.use(router);

(async () => {
  try {
    await connectDB();
    console.log('connected to mongoose');
    app.listen(PORT);
  } catch (e) {
    console.log('could not start server');
  }
})()

export default app; 