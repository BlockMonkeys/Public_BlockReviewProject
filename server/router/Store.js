const express = require("express");
const register_store = require("../controller/Store/register_store");
const { read_store_all, read_store_byId } = require("../controller/Store/read_store");
const router = express.Router();


// /api/blockreview/store
router.post("/register", register_store);
router.get("/get", read_store_all);
router.get("/get/:storeId", read_store_byId);


module.exports = router;