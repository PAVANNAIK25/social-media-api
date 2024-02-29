import app from "./index.js";
import { connectToDB } from "./src/config/mongoose.config.js";

const port = process.env.PORT;

app.listen(port, async ()=>{
    console.log("server is listening at port", port);
    await connectToDB();
})