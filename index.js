import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';

//internal modules
import userRouter from './src/features/users/authentication/users.routes.js';
import ApplicationError from './src/utils/error handle/applicationError.js';
import postRouter from './src/features/posts/post.routes.js';
import { auth } from './src/middlewares/jwt.middleware.js';
import commentRouter from './src/features/comments/comments.routes.js';
import likesRouter from './src/features/likes/like.routes.js';
import apidocs from './swagger.json' assert{type: 'json'};
import profileRouter from './src/features/users/profile/profile.routes.js';
import ApiResponse from './src/utils/apiResponse.js';
import { followRouter } from './src/features/follow/follow.routes.js';


// initializing express app
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swagger.serve, 
    swagger.setup(apidocs, {customSiteTitle: "Social Media API"}));

// routers different routes
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", auth, postRouter);
app.use("/api/comments", auth, commentRouter);
app.use("/api/likes", auth, likesRouter);
app.use("/api/follow", auth, followRouter);

app.get("/", (req, res) => {    
    res.send("Welcome to postaway II");
})

app.use(function (req, res, next) {
    return res.status(404).send("404, resource not found");
})

// Application level error handling
app.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
        return res.status(err.code).send(new ApiResponse(err.code, err.message, "Error"));
    }
    return res.status(500).send(err.message);
})

export default app;