const express = require('express');
const cookieParser = require('cookie-parser');

// import all created routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const manageRoutes = require("./routes/managerRoutes");

const app = express();
const cors = require('cors');

const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true
}

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manage", manageRoutes);


// start server 
app.listen(3000, () => console.log('Server running on localhost:3000'));
