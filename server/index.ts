import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = 3000;

(async () => {
  try {
    await connectDB();
    console.log('connected to mongoose');
    app.listen(PORT);
  } catch (e) {
    console.log('could not start server');
  }
})()
