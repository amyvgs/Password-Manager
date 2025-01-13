const jwt = require('jsonwebtoken');

// function to autheticate jwt token, move to middleware to use in core functionalities to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.status(401).json({message: "no auth header"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: "token is not valid"});
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;