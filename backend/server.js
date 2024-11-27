import express from 'express';
import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import connectDB from './db/connectDB.js';
import "./passport/github.auth.js";
import passport from 'passport';
import session from 'express-session';


dotenv.config();

const app = express();
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/auth", authRoutes);

// Connect to the database first
connectDB().then(() => {
    app.listen(5000, () => {
        console.log('Server started on http://localhost:5000');
    });
}).catch((error) => {
    console.error("Failed to start server due to DB connection issues:", error);
});
