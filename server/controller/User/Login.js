const { db } = require("../../db");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_secretKey;
const { ComparePassword } = require("../../encrypt");

const get_walletType = (req, res) => {    
    const email = req.body.email;
    const findEmailQuery = `SELECT * FROM user WHERE email=?`;
    const findTypeQuery = `SELECT walletType FROM user WHERE email=?`;

    db.query(findEmailQuery, [email], (err, data) => {
        if(err){
            return res.status(400).json({success : false , cause: `DB Err : ${err}` })
        } else {
            if(data.length == 0){
                return res.json({ success: false, cause: "유저가 존재하지 않습니다." });
            } else {
                db.query(findTypeQuery, [email], (err, data) => {
                    if(err){
                        return res.status(400).json({success : false, cause : `DB Err : ${err}`})
                    } else {
                        return res.json({ success : true , payload : data })
                    }
                })
            }  
        }
    });
};


const pubkey_get = (req, res) => {
    const pubkey = req.body.pubkey;
    const email = req.body.email;
    const query = `SELECT accountPubKey FROM user WHERE email=?`
    let dataList = [];
    db.query(query, [email], (err, data) => {
        if(data.length !== 0) {
            for (let result of data){
                dataList.push(result.accountPubKey);
            };  
        }
        if(err){
            return res.status(400).json({ success : false , cause : `DB Err : ${err}`})
        } else {
            if(!data){
                return res.json({ success : false , cause : `유저의 pubkey가 존재하지않습니다 !`  })
            } else {
                if(pubkey !== dataList[0]) {
                    return res.json({ success : false , cause : `pubkey가 일치하지 않습니다.` })
                } else {
                    return res.status(200).json({ success : true , payload : data })
                }
            }
        }
    })
};


const login = (req, res) => {
    const email = req.body.email || null;
    const password = req.body.password;
    const query = `SELECT * FROM user WHERE email=?`;
    const updateQuery = `UPDATE user SET jwtToken=? WHERE email=?`;

    // 유저가 입력한 기준으로 유저를 탐색한다.
    db.query(query, [email], (err, data)=> {
        if(err){
            return res.status(400).json({ success: false, cause: `DB Err : ${err}`});
        } else {
            if(data.length == 0){
                return res.json({ success: false, cause: "유저가 존재하지 않습니다." });
            }

            // 유저가 입력한 비밀번호와, 데이터베이스상의 암호화된 비밀번호를 비교한다;
            if(ComparePassword(password, data[0].password)){
                // JWT Token 생성; (유효시간 2시간)
                const token = jwt.sign(
                        { type: 'JWT', id: data[0].email }, 
                        jwt_secret, 
                        { expiresIn: '400m' }
                );

                // 쿠키생성 유효시간 2시간;
                res.cookie("auth", token, 
                    // 배포후 적용...
                {
                    maxAge: 1000 * 60 * 60 * 4,
                    // httpOnly: true,
                    // path:"/"
                }
                );

                db.query(updateQuery, [token, email], (err, data)=> {
                    return res.status(200).json({ success: true, payload: data });
                });
            } else {
                return res.json({ success: false, cause: "패스워드가 일치하지 않습니다."});
            }
        }
    });
};

module.exports = {login , get_walletType, pubkey_get }