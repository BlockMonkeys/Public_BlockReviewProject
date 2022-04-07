const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_secretKey;
const { db } = require("../db");

const auth = (req, res, next) => {
    const query = `SELECT * FROM user WHERE jwtToken=?`; 
    const token = req.cookies.auth;

    // 로그인 상태인지 검증, 로그인 상태는 DB에 JWT Token값이 존재함.
    if(token === undefined) {
        //로그인 검증 실패
        return res.json({ 
            success: false,
            cause: "쿠키가 존재하지 않습니다."
        });
    }

    db.query(query, [token], (err, data)=> {
        if(data.length > 0){
            // DB상의 JWT Token && COOKIE JWT Token이 같은지 비교.
            if(data[0].jwtToken !== token){
                return res.json({ success: false, cause: "유저가 존재하지 않습니다." });
            };
            // DB내 JWT Token 값이 존재하는 것.
            jwt.verify(token, jwt_secret, (err, decoded)=> {
                if(err) {
                    res.json({ 
                        success: false, 
                        cause: "JWT Token이 유효하지 않습니다."
                    });
                }
                // 검증 통과 시, 다음 컨트롤러로 전달
                req.userId = decoded.id;
                next();
            });
        } else {
            // DB에 존재하지 않음.
            return res.status(400).json({ success: false, cause: "DB 내 JWT토큰이 존재하지 않습니다." });
        }
    })
}

module.exports = auth;