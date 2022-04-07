const { db } = require("../../db");

const create_review = async (req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");

    //parameters
    const idx = await contract_review.methods.TotalSupply().call();
    const title = req.body.title;
    const description = req.body.des;
    const category = req.body.category || "categoryExample";
    const creatorEmail = req.body.creator;
    const ownerPubkey = req.body.pubkey;
    const walletType = req.body.privatekey == "" ? 1 : 0; // 0 = 내부지갑 && 1 = 외부지갑
    const admin = "0xB28333cab47389DE99277F1A79De9a80A8d8678b";
    const nftUri = req.body.nftUri || "NftUriExample";

    // @Required 
    if(title === "" || description === "" || category === "" || creatorEmail === "" || ownerPubkey === "" || admin === "" || nftUri === "") {
        return res.status(400).json({ success : false, message : "Not enough Element"});
    }

    // @MYSQL 글작성
    const writeReview_query = `INSERT INTO review(id, title, description, category, owner) VALUES (?, ?, ?, ?, ?)`;

    // totalSupply(55) -> 55 번 글 -> idx(56);
    if(walletType === 1){
        db.query(writeReview_query, [idx-1, title, description, category, creatorEmail], 
            async(err, data) => {
                    if(err) {
                        return res.status(400).json({ success : false, msg : `DB err : ${err}` })
                    };
                    return res.status(200).json({ success : true, payload: data });
                });
    } else {
        // @내부지갑 유저 GSN 실행
        const createTx = await contract_review.methods.createReview(title, description, admin, 1000, ownerPubkey, nftUri, category);
        const resultReceipt = await send_GSNTX(createTx, ownerPubkey, req.body.privateKey);

        // GSN 예치금 부족 또는 네트워크에러;
        if(!resultReceipt.status){
            return res.status(202).json({ success: false });
        } else {
            db.query(writeReview_query, [idx, title, description, category, creatorEmail], 
                async(err, data) => {
                    if(err) {
                        return res.status(400).json({ success : false, msg : `DB err : ${err}` })
                    };
                return res.status(200).json({ success : true, payload: resultReceipt });
            });
        }
    }
};

module.exports = create_review;