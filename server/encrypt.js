const bcrypt = require('bcrypt');

const EncryptPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, 10);
}

const ComparePassword = (plainPassword, EncryptedPassword) => {
    return bcrypt.compareSync(plainPassword, EncryptedPassword);
}

module.exports = { EncryptPassword, ComparePassword };