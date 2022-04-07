const { db } = require("../../db");

const faucet = async(req, res) => {
    const { web3, contract_review, send_GSNTX } = await require("../../config-web3");
    const sendTo = req.body.sendTo;
    const sendBy = process.env.FAUCET_SENDER; // env
    const privateKey = process.env.FAUCET_PRIVATEKEY; // env
    const amountToSend = 10000;
    // BalanceCheck;
    const query_findUser = `SELECT * FROM faucet WHERE user=?`;
    const query_saveUser = `INSERT INTO faucet(user) VALUES (?)`;

    // 2. 이미 사용한적이 있는지 조회한다.
    db.query(query_findUser, [sendTo], async(err, data)=> {
        //이미 사용한기록이 존재한다면,
        if(data.length > 0){
            return res.json({ success: false, msg: "이미 사용한 유저입니다."});
        }
        //사용기록이 없다면, FAUCET 동작
        const tx = contract_review.methods.transferToken(sendBy, sendTo, amountToSend);
        const result = await send_GSNTX(tx, sendBy, privateKey);
        if(result.status){
            db.query(query_saveUser, [sendTo], (err, data)=> {
                if(err) res.json({ success: false, msg: `DB ERR`});
                return res.json({ success: true, payload : result });
            })
        } else {
            return res.status(400).json({ success: false });
        }
    })
}

module.exports = faucet;