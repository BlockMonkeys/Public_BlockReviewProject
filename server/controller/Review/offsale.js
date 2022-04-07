const { db } = require("../../db");

const offSale = async(req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");
    // @Parameters
    const reviewId = Number(req.body.reviewId);
    const pubKey = req.body.pubkey;
    const privateKey = req.body.privatekey;
    const walletType = req.body.privatekey ? 0 : 1; // 0 = 내부지갑 && 1 = 외부지갑

    // @ 내부지갑유저가 아니라면, 튕겨라.
    if(!walletType === 0 ){
        return res.status(400).json({ success : false , cause : "id is undefined or not innerWalletUser" })
    }

    // @리뷰주인확인;
    const findReviewOwner_query = `SELECT review.id, title, description, owner, category, review.createdAt, accountPubKey  FROM review LEFT JOIN user ON review.owner = user.email WHERE review.id=?;`;
    db.query(findReviewOwner_query, [reviewId], (err, data)=> {
        if(pubKey !== data[0].accountPubKey){
            return res.status(403).json({ success: false, msg: "리뷰 주인이 아닙니다." });
    }});

    // @리뷰 판매중 확인;
    const sc_getReviewById = await contract_review.methods.getReviewById(reviewId).call();
    const currentReviewPrice = Number(sc_getReviewById[4]);
    if(currentReviewPrice === 0){
        return res.status(403).json({ success: false, msg: "현재 판매중인 리뷰가 아닙니다."})
    }

    // @철회 GSN SEND
    const sc_withdrawFromSale = await contract_review.methods.withdrawFromSale(reviewId);
    const sendGSN_withdrawFromSale_result = await send_GSNTX(sc_withdrawFromSale, pubKey, privateKey);

    // @GSN SENDING 실패 : paymaster 금액 부족 OR 일시적 네트워크 오류;
    if(!sendGSN_withdrawFromSale_result){
        return res.status(202).json({ success: false });
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
};

module.exports = offSale;