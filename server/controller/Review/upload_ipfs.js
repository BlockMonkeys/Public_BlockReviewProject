const IpfsApi = require('ipfs-api');
const ipfs = IpfsApi({
    host: '127.0.0.1', 
    port: '5001',
    protocol: 'http'
    // headers: {
    //     authorization :
    // }
});
const fs = require("fs");

// /upload/ipfs
// LOCAL IPFS : http://127.0.0.1:8080/ipfs/{HASH}
// IPFS TESTNET 접속 : https://ipfs.io/ipfs/{해시값}
const upload_ipfs = async (req, res) => {
    console.log(`IPFS`);
    const name = req.files.title.data.toString();
    const description = req.files.description.data.toString();
    const file = req.files.file.data;
    // 1.이미지를 IPFS에 업로드한다.
    const imgupload_result = await ipfs.files.add(file);
    const imgHash = imgupload_result[0].hash;
    //2. 1번과정에서 리턴받은 IPFS 이미지 해시값을 통해 JSON을 생성하고,
    const meta = {
        name,
        description,
        image : imgHash
    }

    //3. JSON파일을 IPFS에 업로드한다. 그리고 리턴된 해시값을 리턴한다.
    const buffer = new Buffer.from(JSON.stringify(meta));
    const json_upload_result = await ipfs.files.add(buffer);

    //+ 클라이언트에서 리턴받은 HASH값을 통해 NFT 민팅 ㄱㄱ
    res.status(200).json({ success : true, payload: json_upload_result });
};

module.exports = upload_ipfs;