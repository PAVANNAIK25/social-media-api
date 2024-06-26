import app from "./index.js";
import { connectToDB } from "./src/config/mongoose.config.js";

const port = process.env.PORT || 8000;

app.listen(port, async ()=>{
    await connectToDB();
    console.log("server is listening at port", port);
})