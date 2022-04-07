const express = require("express");
const create_review = require("../controller/Review/create_review");
const { read_review_all, read_review_byId , read_review_byOwner, read_review_byCategory} = require("../controller/Review/read_review");
const verify_review = require("../controller/Review/verify_review");
const onSale = require("../controller/Review/onsale");
const offSale = require("../controller/Review/offsale");
const trade = require("../controller/Review/trade");
const like_review_byId = require("../controller/Review/like_review");
const upload_ipfs = require("../controller/Review/upload_ipfs");
const router = express.Router();

// /api/blockreview/review
router.post("/create", create_review);
router.get("/read/all", read_review_all);
router.post("/read/owner", read_review_byOwner);
router.post("/read/category", read_review_byCategory);
router.post("/read/:id", read_review_byId);
router.post("/verification", verify_review);
router.post("/sale/onsale", onSale);
router.post("/sale/offsale", offSale);
router.post("/sale/trade", trade);
router.post("/like/:id", like_review_byId);
router.post("/upload/ipfs", upload_ipfs);

module.exports = router;