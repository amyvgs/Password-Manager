const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const logout = async (req, res) => {
    try{
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path:"/"
        });
        res.status(200).json({message: "Cookie deleted successfully"})
    } catch(error){
        console.error("Error during logout: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

// controller for auth user through refreshToken
const authMe = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({message: "No valid refresh token found"});
    }

    try{
        // decode refresh token 
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const {userID, exp } = decoded;

        // determine remaining time for new refresh token
        const timeRemaining = exp - Math.floor(Date.now() / 1000);
        if(timeRemaining <= 0){
            return res.status(400).json({message: "Refresh Token Expired"});
        }

        // create new refresh token with remaining time
        const newRefreshToken = jwt.sign({userID}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:timeRemaining});

        // obtain basic user information with stored id
        const user = await pool.query("SELECT username, first_name, last_name FROM users WHERE user_id = $1", [userID])
        if(!user){
            return res.status(401).json({message: "Invalid user"});
        }

        // if successful generate new accessToken and store refresh token
        const accessToken = jwt.sign({userID}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"10m"});

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path:"/",
            maxAge: timeRemaining * 1000
        });


        res.status(200).json({accessToken: accessToken, user: {username: user.rows[0].username, name: `${user.rows[0].first_name} ${user.rows[0].last_name}`}})
    } catch (error){
        console.error("User validation failed");
        res.clearCookie('refreshToken');
        res.status(401).json({message: "Invalid or expired refresh token"})
    }
}

// controller for refreshing tokens
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    try {
        console.log('attempting token refresh...')
        const decodedJwt = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // create new access code
        const userObject = { userID: decodedJwt.userID };
        const newAccessToken = generateAccessToken(userObject);

        // return access code
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Refresh token not verified: ", error);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

}

// controller for account creation
const register = async (req, res) => {
    const { email, username, password, firstname, lastname } = req.body;

    try {
        // hash supplied password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        // insert user into Database
        const query = 'INSERT INTO users (first_name, last_name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, first_name, last_name, username';
        const result = await pool.query(query, [firstname, lastname, username, email, hashedPassword]);

        // create a access jwt 
        const userObject = { userID: result.rows[0].user_id };
        const accessToken = generateAccessToken(userObject);

        // create a refresh jwt
        const refreshToken = jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30m" });

        // create http only cookie to store refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day duration
        });


        res.status(201).json({ message: "User Registered Successfully", accessToken: accessToken, user: {username: result.rows[0].username, name: `${result.rows[0].first_name} ${result.rows[0].last_name}`}});
    } catch (error) {
        // if duplicate entry return message to display to user
        if (error.code === 23505) {
            res.status({ message: "Email or Username already in use" })
        } else {
            console.error(error);
            res.status(500).json({ message: "Error Creating User Instance" });
        }
    }
};

// contoller for login 
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if email exists in database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // if there are no results, then account does not exist
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Invalid Email or Password" });
        }

        const user = result.rows[0];

        // compared password hash with stored password
        const isPassValid = await bcrypt.compare(password, user.password_hash);

        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // create a access jwt 
        const userObject = { userID: user.user_id };
        const accessToken = generateAccessToken(userObject);

        // create a refresh jwt
        const refreshToken = jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30m" });

        // create http only cookie to store refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path:"/",
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day duration
        });


        // return message and jwt
        res.status(200).json({ message: "Login Successful", accessToken: accessToken, user:{username: user.username, name: `${user.first_name} ${user.last_name}`} })

    } catch (error) {
        console.error("Error logging in: ", error);
        return res.status(500).json({ message: "server error" });
    }
}

// function that generates token with expiration time
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}


module.exports = { logout ,authMe, register, login, refreshToken }