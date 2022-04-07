const create_eoa = async(req, res) => {
    const { web3 } = await require("../../config-web3");

    const result = await web3.eth.accounts.create();
    res.status(200).json({ success : true, payload: result});
};

module.exports = create_eoa;