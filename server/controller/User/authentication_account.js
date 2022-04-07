const { db } = require("../../db");

const authentication_account = (req, res) => {
    const email = req.userId;
    // auth middleware에서 userId를 받아오고, 만약 존재하지 않는다면, reject.
    if(!email) res.status(400).json({ success: false, cause: "No Token" });
    
    const query = `SELECT id, email, phone, role, nickname, registeredAt, resignedAt, accountPubkey, jwtToken, companyNumber, walletType  FROM user WHERE email=?`;
    db.query(query, [email], (err, data)=> {
        if(err) res.status(400).json({ success: false, cause: `DB ERR :${err}`});
        return res.status(200).json({
            success : true,
            id: data[0].id,
            email : data[0].email,
            phone : data[0].phone,
            role : data[0].role,
            nickname : data[0].nickname,
            registeredAt : data[0].registeredAt,
            resignedAt : data[0].resignedAt,
            accountPubKey : data[0].accountPubkey,
            jwtToken : data[0].jwtToken,
            companyNumber: data[0].companyNumber,
            walletType: data[0].walletType,
            auth: true,
        })
    })
}

module.exports = authentication_account;