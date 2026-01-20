
import express from "express";
import cors from "cors";
const app = express();
import router from "./router.js";

app.use(cors());
app.use(express.json());
app.use(router);

//invalid router error handling
app.use((req,res,next) => {
    res.status(404).json({
        message:'Not Found'
    })
})

export default app;