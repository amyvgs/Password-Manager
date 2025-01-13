const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { encryptData, decryptData } = require("../utils/Encryption");

require('dotenv').config();

const tempTest = (req, res) => {
    console.log("Connected to backend...");
    res.json({message: "test action completed"});
}

const obtainUserCategories = async (req, res) => {
    // obtain user id from access token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const userID = decodedToken.userID;

    try{
        // create query to obtain all categories
        const result = await pool.query("SELECT category_id, category_name, category_color FROM user_categories WHERE user_id = $1", [userID]);
        res.status(200).json({message: "Categories obtained successfully", userCategories: result.rows});
    }catch (error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// function to let users store a new password entry
const createNewPassword = async (req, res) => {
    const { name, password, chosenCategory, categoryColor } = req.body;
    const client = await pool.connect();

    // obtain user id from access token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const userID = decodedToken.userID;

    try{
        // begin transaction 
        await client.query("BEGIN");

        let categoryID = null;

        // complete the following if category is supplied
        if(chosenCategory){
            const categoryRes = await client.query("SELECT category_id FROM user_categories WHERE user_id = $1 AND category_name = $2", [userID, chosenCategory]);

            if(categoryRes.rows.length > 0){
                categoryID = categoryRes.rows[0].category_id;
            } else{
                const newCategoryRes = await client.query("INSERT INTO user_categories (user_id, category_name, category_color) VALUES ($1, $2, $3) RETURNING category_id", [userID, chosenCategory, categoryColor]);
                categoryID = newCategoryRes.rows[0].category_id;
            }
        }
        
        // encrypt given password before putting in table as well as iv and auth_tag
        const {encryptedData, iv, authTag} = encryptData(password);

        // insert password into table
        await client.query("INSERT INTO passwords (user_id, category, password_name, password, iv, auth_tag) VALUES ($1, $2, $3, $4, $5, $6)", [userID,categoryID, name, encryptedData, iv, authTag]);

        // send successful response and commit transaction
        res.status(200).json({message: "Password Stored Successfully", category_id: categoryID});
        await client.query("COMMIT");
    } catch(error){
        // if error occurs, rollback transaction to prevent any changes 
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    } finally {
        // release client
        client.release();
    }
}

// function to obtain all passwords under user
const obtainUserPasswords = async (req, res) => {

    // obtain user id from access token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const userID = decodedToken.userID;

    try{

        const query  = "SELECT p.password_id, c.category_name, c.category_color, p.password_name, p.password, p.last_updated, p.iv, p.auth_tag FROM passwords p LEFT JOIN user_categories c ON p.category = c.category_id WHERE p.user_id = $1"
        //"SELECT password_id, category, password_name, password, last_updated, iv, auth_tag FROM passwords WHERE user_id = $1"

        const result = await pool.query(query, [userID]);
        console.log(result.rows);
        const allRows = result.rows;

        const userPasswords = allRows.map((element) => {
            let newObj = {
                password_id: element.password_id,
                category: element.category_name,
                category_color: element.category_color,
                password_name: element.password_name,
                password: decryptData(element.password, element.iv, element.auth_tag),
                last_updated: element.last_updated,
            };

            return newObj
        });

        res.status(200).json({message: "All user passwords obtained successfully!", userPasswords:userPasswords});
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// get passwords with given category id
const obtainPasswordsWithCategories = async(req,res) => {
    const { category_id } = req.body;

    try{
        const query = "SELECT p.password_id, c.category_name, c.category_color, p.password_name, p.password, p.last_updated, p.iv, p.auth_tag FROM passwords p LEFT JOIN user_categories c ON p.category = c.category_id WHERE category = $1" 
        //"SELECT * FROM passwords WHERE category = $1"
        const result = await pool.query(query, [category_id]);
        const allRows = result.rows;

        const userPasswords = allRows.map((element) => {
            let newObj = {
                password_id: element.password_id,
                category: element.category_name,
                category_color: element.category_color,
                password_name: element.password_name,
                password: decryptData(element.password, element.iv, element.auth_tag),
                last_updated: element.last_updated,
            };

            return newObj
        });

        res.status(200).json({ message: "All user passwords obtained successfully!", userPasswords: userPasswords });
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
    }

}

module.exports = { tempTest, createNewPassword, obtainUserCategories, obtainUserPasswords, obtainPasswordsWithCategories }