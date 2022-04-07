const { db } = require("../../db");
const { EncryptPassword } = require("../../encrypt");

const register = async(req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");

    // @ Parameters
    const email = req.body.email;
    const password = EncryptPassword(req.body.password);
    const phone = req.body.phone || null;
    const role = req.body.role;
    const nickname = req.body.nickname;
    const accountPubkey = req.body.pubkey;
    const walletType = req.body.privatekey ===  "" ? 1 : 0; // 0 = 내부지갑 && 1 = 외부지갑
    const companyNumber = req.body.storeId === "" ? null : req.body.storeId;

    // @ Contract Send
    if(walletType === 0) {
        console.log(`--GSN SENDING--`);
        //내부지갑 유저
        const contract_gsnApprove = await contract_review.methods.approveForGSN(100000000);
        const contract_nftApprove = await contract_review.methods.approveForNFT(accountPubkey);
        // @ GSN Approve
        const contract_gsnApproveResult = await send_GSNTX(contract_gsnApprove, accountPubkey, req.body.privatekey);
        // @ NFT Approve
        const contract_nftApproveResult = await send_GSNTX(contract_nftApprove, accountPubkey, req.body.privatekey);

        if(!contract_gsnApproveResult.status && !contract_nftApproveResult.status){
            console.log(`Register User GSN ERR`);
            return res.json({ success: false, cause: `GSN ERR` });
        }
    }
    
    // @ 회원등록 in MySQL
    const query = `INSERT INTO user(email, password, phone, role, nickname, accountPubkey, walletType, companyNumber)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [email, password, phone, role, nickname, accountPubkey, walletType, companyNumber], (err, data)=> {
        if(err) {
            return res.json({ 
                success: false, 
                cause: `DB ERR :${err}`
            });
        } else {
            return res.status(200).json({ 
                success: true 
            });
        }
    });
}

const checkOverlap = (req, res) => {
    const element = req.body.element;
    const content = req.body.content;

    const query = `SELECT * FROM user WHERE ${element}=?`;

    db.query(query, [content], (err, data)=> {
        if(data.length > 0){
            //이미 존재한다면,
            res.json({ success: false, msg: "already Exist"});
        } else {
            //존재하지 않는다면
            res.status(200).json({ success: true });
        }
    });
};

module.exports = { register, checkOverlap };