const { db } = require("../../db");
const logout = (req, res) => {
    try {
        const token = req.cookies.auth;
        const email = req.userId;
        const query = `UPDATE user SET jwtToken=? WHERE email=?`;
    
        // 쿠키가 존재한다면, 쿠키를 삭제해라.
        if(token){
            res.clearCookie('auth');
        }

        // DB에서 jwtToken을 삭제해라.
        db.query(query, [null, email], (err, data)=> {
            if(err) res.status(400).json({ success: false, cause: `DB ERR ${err}`});
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        res.status(400).json({ success: false, cause: err });
    }
};

module.exports = logout;