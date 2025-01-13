const crypto = require("crypto");
require('dotenv').config();


// function to encrypt data
const encryptData = (data) => {
    // generate iv each password encryption
    let iv = crypto.randomBytes(16).toString('hex');

    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    let encryptedData = cipher.update(data,'utf8', 'hex');
    encryptedData += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex')
    return {encryptedData, iv, authTag};
}  


// function to decrypt data
const decryptData = (encryptedData,iv,authTag) => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag,'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData
}

module.exports = {encryptData, decryptData};