const bcrypt = require('bcrypt');

async function generateDefaultPassword(defaultPassword) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    return hashedPassword;
}

module.exports = { generateDefaultPassword }