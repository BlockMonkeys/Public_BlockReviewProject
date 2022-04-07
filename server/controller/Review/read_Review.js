const { db } = require("../../db");
const _ = require("lodash");
const read_review_all = (req, res) => {
    const query = `SELECT review.id, title, description, category, owner, review.createdAt, user.nickname, user.registeredAt, accountPubKey, walletType FROM review LEFT JOIN user ON review.owner = user.email`;
    db.query(query, (err, data) => {
        if(err) res.status(400).json({ success : false , message : `DB ERR ${err}`})
        return res.status(200).json({ success : true , payload : data});
    });
};

const read_review_byId = async(req , res) => {
    const { contract_review } = await require("../../config-web3");
    const id = req.params.id;

    try {
        if(id === ""){
            return res.status(400).json({ success : false}) 
        }

        const result = await contract_review.methods.getReviewById(id).call();

        let obj = {
            title: result[0],
            description: result[1],
            writer: result[2],
            likedUser: result[3],
            price: result[4],
            category: result[5],
            createdAt: result[6]
        }

        return res.status(200).json({ success : true , payload : obj});

    } catch(err) {
        return res.status(400).json({ success : false })
    }
};

const read_review_byOwner = async (req, res) => {
    const { contract_review } = await require("../../config-web3");
    const pubKey = req.body.pubkey;

    try {
        if(pubKey == ""){
            return res.status(400).json({ success : false })
        } 
        const result = await contract_review.methods.getReviewByWriter(pubKey).call();
        let resultAry = [];
        result.map((item, idx) => {
            if(item[0] === "0"){
                return;
            }
            let obj = {
                id: item[0],
                title: item[1],
                description: item[2],
                writer: item[3],
                likedUser: item[4],
                nftId: item[5],
                price: item[6],
                category: item[7],
                createdAt: item[8]
            }
            resultAry.push(obj);
        })

        //resultAry 중복을 제거하고, 보내라
        resultAry = _.uniqBy(resultAry, "id");

        // ID 순서대로 정렬하기
        resultAry.sort(function(a, b) {
            return a.id - b.id;
        })
        
        return res.status(200).json({ success: true , payload : resultAry })
    } catch(err){
        return res.status(400).json({ success : false })
    }
}

const read_review_byCategory = (req, res) => {
    const category = req.body.category 
    db.query(`SELECT * FROM review LEFT JOIN user ON review.owner = user.email WHERE review.category=?;`, [category], (err, data) => {
        if(err) {
            return res.status(400).json({success : false, message : `DB ERR ${err}`});
        }
        return res.status(200).json({success : true, payload : data });
    });
}



module.exports = {read_review_all, read_review_byId, read_review_byOwner, read_review_byCategory};