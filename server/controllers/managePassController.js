const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { encryptData } = require("../utils/Encryption");
require('dotenv').config();

const deletePassword = async (req, res) => {
    const { password_id } = req.body;
    console.log(password_id);
    try {
        const result = await pool.query("DELETE FROM passwords WHERE password_id = $1 RETURNING password_id", [password_id]);
        console.log(`Successfully deleted password: ${result.rows[0].password_id}`);
        res.status(200).json({ message: "Succssful password deletion" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updatePassword = async (req, res) => {
    const { password_id, password_name, password, category, category_color } = req.body;
    const client = await pool.connect();

    // obtain user id from access token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const userID = decodedToken.userID;

    try {
        // begin transaction 
        await client.query("BEGIN");

        let categoryID = null;

        if (category) {
            const categoryRes = await client.query("SELECT category_id FROM user_categories WHERE user_id = $1 AND category_name = $2", [userID, category]);

            if (categoryRes.rows.length > 0) {
                categoryID = categoryRes.rows[0].category_id;
            } else {
                const newCategoryRes = await client.query("INSERT INTO user_categories (user_id, category_name, category_color) VALUES ($1, $2, $3) RETURNING category_id", [userID, category, category_color]);
                categoryID = newCategoryRes.rows[0].category_id;
            }
        }

        const { encryptedData, iv, authTag } = encryptData(password);
        const currTime = new Date().toISOString();

        const query = "UPDATE passwords SET password_name = $1, password = $2, category = $3, last_updated = $4, iv = $5, auth_tag = $6  WHERE password_id = $7 RETURNING password_id";
        const result = await client.query(query, [password_name, encryptedData, categoryID, currTime, iv, authTag, password_id]);
        
        console.log(`Successfully updated password ${result.rows[0].password_id}`);
        res.status(200).json({ message: "Password updated successfully", category_id: categoryID, category_name:category });
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        client.release();
    }

}

const updateCategory = async (req, res) => {
    const { category_id, category_name, category_color } = req.body;

    try {
        const query = "UPDATE user_categories SET category_name = $1, category_color = $2 WHERE category_id = $3 RETURNING category_id";
        const result = await pool.query(query, [category_name, category_color, category_id]);
        console.log(`Successfully Updated Category ${result.rows[0].category_id}`);
        res.status(200).json({ message: "Category Updated Successfully" });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Issue With Updating Category" });
    }
}

const deleteCategory = async (req, res) => {
    const { category_id } = req.body;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // first begin deleting the category, returning the id
        const catDeletion = await client.query("DELETE FROM user_categories WHERE category_id = $1 RETURNING category_id", [category_id]);
        const catID = catDeletion.rows[0].category_id;

        // then attempt to set all passwords with id to null
        const passUpdated = await client.query("UPDATE passwords SET category = null WHERE category = $1", [category_id]);
        console.log("Password Updated successfully")
        res.status(200).json({ message: "Category deleted successfully!" });
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
    } finally {
        client.release();
    }
}


module.exports = { deletePassword, updatePassword, updateCategory, deleteCategory };