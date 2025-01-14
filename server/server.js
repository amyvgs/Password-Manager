const express = require('express');
const cookieParser = require('cookie-parser');

// import all created routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const manageRoutes = require("./routes/managerRoutes");

const app = express();
const cors = require('cors');

const corsOptions = {
    origin: ["http://localhost:5173", "https://passwordsafe.onrender.com"],
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
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
