import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.use("/api/users", userRoutes)

app.listen(5000, ()=> {
    console.log('Server started on http://localhost:5000');
})