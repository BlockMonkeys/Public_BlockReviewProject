const like_review_byId = async (req, res) => {
    const { contract_review, send_GSNTX } = await require("../../config-web3");
    const pubkey = req.body.pubkey;
    const walletType = req.body.privatekey ? 0 : 1; // 0 = 내부지갑 && 1 = 외부지갑
    const id = req.params.id;
    const admin = "0xB28333cab47389DE99277F1A79De9a80A8d8678b";
    
    // @ 내부지갑유저가 아니라면, 튕겨라.
    if(!walletType === 0 ){
        return res.status(400).json({ success : false , cause : "id is undefined or not innerWalletUser" })
    } else {
        //블록체인 좋아요 생성
        const createTx = await contract_review.methods.createLiked(id, admin, 100);
        const GSNsend_createTxResult = await send_GSNTX(createTx, pubkey, req.body.privatekey);

        //GSN 예치금 부족 또는 네트워크 에러
        if(!GSNsend_createTxResult.status) {
            return res.status(202).json({ success: false });
        }

        return res.status(200).json({ success : true });
    }
}

module.exports = like_review_byId;