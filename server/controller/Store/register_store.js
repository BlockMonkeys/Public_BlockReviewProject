const { db } = require("../../db");

const register_store = (req, res) => {
    const { id, name, description, owner, img } = req.body;

    if(id === "" || name === "" || description === "" || owner === "" || img === "" ) {
        return res.json({ success : false  , message : "Not enough Element"});
    }

    const registerStore_query = `INSERT INTO store(id, name, description, owner, img) VALUES(?, ?, ?, ?, ?)`;

    db.query(registerStore_query, [id, name, description, owner, img], (err, data)=> {
        if(err) res.status(400).json({ success: false });
        return res.status(200).json({ success: true });
    })
}

module.exports = register_store;