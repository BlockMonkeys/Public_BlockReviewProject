const { db } = require("../../db");

const read_store_all = (req, res) => {
    const readStore_All_query = `SELECT * FROM store`;

    db.query(readStore_All_query, (err, data)=> {
        if(err) res.status(400).json({ success: false });
        return res.status(200).json({ success: true, payload: data });
    })
}

const read_store_byId = (req, res) => {
    const storeId = req.params.storeId;
    const readStore_byId_query = `SELECT * FROM store where id=?`;

    db.query(readStore_byId_query, [storeId], (err, data)=> {
        if(err) res.status(400).json({ success: false });
        return res.status(200).json({ success: true, payload: data});
    })
}

module.exports = {read_store_all, read_store_byId};