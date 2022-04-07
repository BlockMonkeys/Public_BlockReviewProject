const { db } = require("../../db");

const onSale = async(req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");
    // @Parameters
    const reviewId = Number(req.body.reviewId);
    const price = Number(req.body.price);
    const pubKey = req.body.pubkey;
    const privateKey = req.body.privatekey;
    // @블록체인 리뷰 조회
    const sc_getReviewById = await contract_review.methods.getReviewById(reviewId).call();
    const sc_registerForSale = await contract_review.methods.registerForSale(reviewId, price);
    const currentReviewPrice = Number(sc_getReviewById[4]);

    // @리뷰주인확인;
    const findReviewOwner_query = `SELECT review.id, title, description, owner, category, review.createdAt, accountPubKey FROM review LEFT JOIN user ON review.owner = user.email WHERE review.id=?;`;
    db.query(findReviewOwner_query, [reviewId], (err, data)=> {
        if(pubKey !== data[0].accountPubKey){
            return res.status(403).json({ success: false, msg: "리뷰 주인이 아닙니다." });
        }
    });

    // @판매등록 여부확인 price가 0이면 판매중 아님, price가 0이상이면 값 수정으로.
    if(!currentReviewPrice === 0) {
        //판매중인 리뷰이다. 판매 철회 후, 이용할 수 있도록 해라.
        return res.status(403).json({ success: false, msg: "이미 판매중인 리뷰입니다." });
    } 

    // @ 판매중이 아님. -> 판매등록하기
    const sendGSN_registerForSale_result = await send_GSNTX(sc_registerForSale, pubKey, privateKey);
    
    // @ GSN SENDING이 실패 경우 : paymaster 입금 금액이 부족하다. 또는 일시적 네트워크 오류 확률;
    if(!sendGSN_registerForSale_result.status){
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

module.exports = onSale;