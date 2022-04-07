const { db } = require("../../db");

const verify_review = async (req, res) => {
    const { contract_review } = await require("../../config-web3");

    // @Parameters
    const category = req.body.category;

    if(category === "") {
        return res.json({ success: false, msg : `category is empty` });
    }

    const findByCategory_query = `SELECT review.id, title, description, owner, category, review.createdAt, accountPubKey  FROM review LEFT JOIN user ON review.owner = user.email WHERE review.category=?;`;
    db.query(findByCategory_query, [category], async(err, data)=> {
        if(err) {
            return res.status(400).json({ success: false, msg: `DB : ${err}`});
        }

        // MYSQL에 데이터가 없다면?
        if(data.length < 1){
            return res.json({ success: false, msg : `No Data` });
        }

        let result = data;

        // Id, Title, Description, accountPubKey 비교
        const getReviewByCategory_result = await contract_review.methods.getReviewByCategory(category).call();
        
        let blockchainData = [];

        // Blockchain Data 재정렬
        getReviewByCategory_result.map((item, idx)=> {
            let obj = {
                id : item[0],
                title: item[1],
                description: item[2],
                owner: item[3],
                liked: item[4],
                nftId: item[5],
                price: item[6],
                category: item[7],
                createdAt: item[8]
            }
            blockchainData.push(obj);
        });

        // Result 항목에 verifed 항목 추가.
        blockchainData.map((resultItem, idx)=> {
            resultItem["verified"] = false;
        });
        // 검증진행  
        blockchainData.map((blockData, blockIdx)=> {
            result.map((sqlData, sqlIdx)=> {
            if(sqlData.id == blockData.id && sqlData.title == blockData.title && sqlData.description == blockData.description && sqlData.accountPubKey == blockData.owner){
                blockchainData[blockIdx]["verified"] = true;
                blockchainData[blockIdx]["email"] = sqlData.owner;
            }
        });
    });
        return res.status(200).json({ success: true, payload : blockchainData });
    })
};




module.exports = verify_review;