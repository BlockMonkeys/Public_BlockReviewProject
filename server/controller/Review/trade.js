const { db } = require("../../db");

const trade = async(req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");

    // @ Parameters;
    const reviewId = Number(req.body.reviewId);
    const email_buyer = req.body.email;
    const pubKey_buyer = req.body.pubkey_buyer;
    const privateKey_buyer = req.body.privatekey_buyer;
    const walletType = req.body.privatekey_buyer === "" ? 1 : 0; // 1 = 외부지갑; 0 = 내부지갑 ;

    // @ 외부지갑유저 = DB만 적용
    if(walletType === 1) {
        // @ DB 내 Owner 업데이트.
        const updateOwner_query = `UPDATE review SET owner=? WHERE id=?`;
        db.query(updateOwner_query, [email_buyer ,reviewId], async(err, _) => {
             // DATABASE ERR
            if(err) {
                return res.status(400).json({ success: false, msg: `DB UPDATE FAIL : ${err}`});
            }
            return res.status(200).json({ success: true });
        });
    } else {
        // @내부지갑유저 = GSN -> DB
        // @ NFT Trade
        const findReviewOwner_query = `SELECT review.id, title, description, owner, category, review.createdAt, accountPubKey  FROM review LEFT JOIN user ON review.owner = user.email WHERE review.id=?;`;

    db.query(findReviewOwner_query, [reviewId], async(err, data_findReview)=> {
        if(data_findReview.length === 0) {
            return res.status(400).json({ success: false, msg: "리뷰가 존재하지 않습니다." });
        }

        // @ 리뷰 판매중 확인;
        const sc_getReviewById = await contract_review.methods.getReviewById(reviewId).call();
        const currentReviewPrice = Number(sc_getReviewById[4]);
        const sc_saleNFT = await contract_review.methods.saleNFT(data_findReview[0].accountPubKey, pubKey_buyer, reviewId, currentReviewPrice);
        const sendGSN_saleNFT_result = await send_GSNTX(sc_saleNFT, pubKey_buyer, privateKey_buyer);

        // @ GSN SENDING이 실패 경우 : paymaster 입금 금액이 부족하다. 또는 일시적 네트워크 오류 확률;
        if(!sendGSN_saleNFT_result.status){
            return res.status(202).json({ success: false });
        }

        // @ DB 내 Owner 업데이트.
        const updateOwner_query = `UPDATE review SET owner=? WHERE id=?`;
        db.query(updateOwner_query, [email_buyer ,reviewId], async(err, _) => {
             // DATABASE ERR
            if(err) {
                return res.status(400).json({ success: false, msg: `DB UPDATE FAIL : ${err}`});
            }
            // @ 정상처리
            const result = await contract_review.methods.getReviewById(reviewId).call();
            const refinedResult = {
                title: result[0],
                description: result[1],
                owner: result[2],
                likedUsers: result[3],
                price: result[4],
                category: result[5],
                createdAt: result[6]
            }
            return res.status(200).json({ success: true, payload: refinedResult });
        });
    });
    }
};

module.exports = trade;