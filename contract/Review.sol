// SPDX-License-Identifier: MIT;

pragma solidity 0.8.7;

import "./ReviewCoin.sol";
import "./ReviewNFT.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract BlockReview is BaseRelayRecipient{

    ReviewCoin public reviewCoinAddress;
    ReviewNFT public reviewNftAddress;

    constructor(address payable _tokenContractAddress, address payable _nftContractAddress, address _forwarderAddress) payable {
        reviewCoinAddress = ReviewCoin(_tokenContractAddress);
        reviewNftAddress = ReviewNFT(_nftContractAddress);
        _setTrustedForwarder(_forwarderAddress);
    }

    string public override versionRecipient = "2.2.0";

    struct Review {
        uint id;
        string title;
        string description;
        address writer;
        address[] likedUser;
        uint nftId;
        uint price; // if price == 0 : no Sale && if price > 0 : Sale;
        string category; // StoreId Category; UUID;
        uint createdAt;
    }

 

    uint public TotalSupply = 1;

    mapping (uint => Review) public Review_mapping;
    mapping (address => uint[]) public reviewByWriter_mapping;
    mapping (string => uint[]) public reviewByCategory_mapping;

    event review_event(string title, string description, address writer, uint nftId);
    event like_event(string title, string description, address writer, address[] likedUser);
    event tradeNft_event(address _from, address _to, uint _tokenId);


    // 회원관리
    // GSN Approve;
    function approveForGSN(uint256 _amount) public payable {
        reviewCoinAddress.approveByGSN(_msgSender(), address(this), _amount);
    }

    // NFT Approve;
    function approveForNFT(address _tokenOwner) public payable {
        reviewNftAddress.approveForAll(_tokenOwner, address(this));
    }

    // Review`s

    // 글쓰기
    function createReview (string memory _title, string memory _des, address _admin, uint _amount, address _nftOwner, string memory _nftUri, string memory _category) public payable {
        // @Exception
        require(bytes(_title).length > 9, "Title is too short"); // KOR = Letter/3bytes && ENG = Letter/1
        require(bytes(_des).length > 9, "Description is too short");

        // @Logic
        // Create NFT;
        mintNft(_nftOwner, _nftUri);

        // Create Struct Data;
        address[] memory liked;
        Review_mapping[TotalSupply] = Review(TotalSupply, _title, _des, _msgSender(), liked, TotalSupply, 0, _category, block.timestamp);

        // Create Mapping Data (Category)
        reviewByCategory_mapping[_category].push(TotalSupply);

        // Create Mapping Data (Writer)
        reviewByWriter_mapping[_msgSender()].push(TotalSupply);

        // Transfer;
        reviewCoinAddress.transferFrom(_msgSender(), _admin, _amount);

        // emit Event
        emit review_event(_title, _des, _msgSender(), TotalSupply);

        // TotalSupply Up!
        TotalSupply++;
    }

    // Review 좋아요;
    function createLiked(uint _reviewId, address _admin, uint _amount) public payable {
        // Exception
        require(TotalSupply > _reviewId, "No Reviews");
        require(Review_mapping[_reviewId].writer != _msgSender(), "Writer Can not Liked own's Review"); //내가 내 글을 좋아요하면 안됨.

        // Logic
        // @dev Struct Review의 LikedUser에 _msgSender()가 존재하는지 확인;
        // @dev Struct Review의 likedUser에 추가하기;
        uint likedUserAryLength = Review_mapping[_reviewId].likedUser.length;
        
        // 좋아요 중복 방지;
        for(uint i=0; i < likedUserAryLength; i++) {
            if(Review_mapping[_reviewId].likedUser[i] == _msgSender()){
                revert("Already Liked User!");
            }
        }

        //좋아요 유저 추가;
        Review_mapping[_reviewId].likedUser.push(_msgSender());

        // Transfer;
        uint len = Review_mapping[_reviewId].likedUser.length;
        if(len == 0){
            //좋아요 한 유저가 없다면?
            // 운영자 20%;
            reviewCoinAddress.transferFrom(_msgSender(), _admin, _amount * 2/10);
            // 글쓴이한테 80%;
            reviewCoinAddress.transferFrom(_msgSender(), Review_mapping[_reviewId].writer, _amount * 8/10);
        } else {
            //좋아요 한 유저가 있다면?
            //운영자 10%;
            reviewCoinAddress.transferFrom(_msgSender(), _admin, _amount * 1/10);
            // 글쓴이한테 80%;
            reviewCoinAddress.transferFrom(_msgSender(), Review_mapping[_reviewId].writer, _amount * 8/10);
            // 좋아요 한 유저들한테 N빵;
            uint shareholder_amount = (_amount * 1/10) / len;
            for(uint i=0; i < len; i++){
                reviewCoinAddress.transferFrom(_msgSender(), Review_mapping[_reviewId].likedUser[i], shareholder_amount);
            }
        }
        // Event
        emit like_event(Review_mapping[_reviewId].title, Review_mapping[_reviewId].description, Review_mapping[_reviewId].writer, Review_mapping[_reviewId].likedUser);
    }

    // Review 조회;
    function getReviewById(uint _reviewId) public view returns (string memory, string memory, address, address[] memory, uint, string memory, uint){
        require(TotalSupply > _reviewId, "No Reviews");
        return(Review_mapping[_reviewId].title, Review_mapping[_reviewId].description, Review_mapping[_reviewId].writer, Review_mapping[_reviewId].likedUser, Review_mapping[_reviewId].price, Review_mapping[_reviewId].category, Review_mapping[_reviewId].createdAt);
    }

    function getReviewByWriter(address _writer) public view returns(Review[] memory) {
        // @Exception
        // @Logic
        Review[] memory result = new Review[](TotalSupply);
        
        // Review Mapping 순회
        for (uint i=1; i < TotalSupply; i++){
            // Review Stuct Writer 일치확인;
            if(Review_mapping[i].writer == _writer){
                // result Array에 값을 넣어야한다. 하지만 memory array에 push는 불가능. 이므로, result[idx] = Review Sturct 형식으로 삽입.
                for(uint x=0; x < reviewByWriter_mapping[_writer].length; x++) {
                    if(result[x].id != reviewByWriter_mapping[_writer][x]) {
                        result[x] = Review(Review_mapping[i].id, Review_mapping[i].title, Review_mapping[i].description, Review_mapping[i].writer, Review_mapping[i].likedUser, Review_mapping[i].nftId, Review_mapping[i].price, Review_mapping[i].category, Review_mapping[i].createdAt);
                    }
                }
            }
        }
        return result;
    }

    function getReviewByCategory(string memory _category) public view returns(Review[] memory) {
        // @Exception
        // @Logic
        Review[] memory result = new Review[](reviewByCategory_mapping[_category].length);
        
        // Review Mapping 순회
        for (uint i=1; i < TotalSupply; i++){
            // Review Stuct Category 일치확인; (문자열비교);
            if(keccak256(bytes(Review_mapping[i].category)) == keccak256(bytes(_category))){
                // result Array에 값을 넣어야한다. 하지만 memory array에 push는 불가능. 이므로, result[idx] = Review Sturct 형식으로 삽입.
                for(uint x=0; x < reviewByCategory_mapping[_category].length; x++) {
                    if(result[x].id != reviewByCategory_mapping[_category][x]) {
                        result[x] = Review(Review_mapping[i].id, Review_mapping[i].title, Review_mapping[i].description, Review_mapping[i].writer, Review_mapping[i].likedUser, Review_mapping[i].nftId, Review_mapping[i].price, Review_mapping[i].category, Review_mapping[i].createdAt);
                    }
                }
            }
        }
        return result;
    }

    // Token`s

    //Token Transfer
    function transferToken(address _sendBy, address _sendTo, uint _amount) public payable {
        reviewCoinAddress.transferFrom(_sendBy, _sendTo, _amount);
    }

    // NFT`s

    // NFT 생성;
    function mintNft(address _owner, string memory _tokenURI) internal {
        // @Logic
        reviewNftAddress.minting(_owner, _tokenURI, TotalSupply);
    }

    // NFT 조회;
    function getNftOwnerOf(uint _nftId) public view returns(address){
        return reviewNftAddress.ownerOf(_nftId);
    }

    function getNftTokenUri(uint _nftId) public view returns(string memory){
        return reviewNftAddress.tokenURI(_nftId);
    }

    function getNftBalanceOf(address _owner) public view returns(uint){
        return reviewNftAddress.balanceOf(_owner);
    }


    // NFT 판매;

    // 판매등록
    function registerForSale(uint _tokenId, uint _price) public payable {
        // @Exception
        // _owner == msg.sender냐?
        require(getNftOwnerOf(_tokenId) == _msgSender(), "Your Not Owner of NFT");

        // @Logic
        // Review Struct의 price를 변경해라 !
        Review_mapping[_tokenId].price = _price;
    }

    // 판매철회
    function withdrawFromSale(uint _tokenId) public payable {
        // @Exception
        // _owner == msg.sender냐?
        require(getNftOwnerOf(_tokenId) == _msgSender(), "Your Not Owner of NFT");

        // @Logic
        Review_mapping[_tokenId].price = 0;
    }


    // Transfer (호출자 : 구매자)
    function saleNFT(address _owner, address _buyer, uint _tokenId, uint _amount) public payable {
        // @Exception
        // Owner Cannot Call
        require(_owner != _msgSender(), "You are the owner of NFT");
        // Review Price = 0보다 크냐?
        require(Review_mapping[_tokenId].price > 0, "It is not OnSALE");
        // _amount = Review Price 랑 같냐?
        require(_amount == Review_mapping[_tokenId].price, "Your Amount is not matched with price");

        // @Logic
        // Transfer NFT
        reviewNftAddress.safeTransferFrom(_owner, _buyer, _tokenId);

        // Review Writer Update;
        Review_mapping[_tokenId].writer = getNftOwnerOf(_tokenId);
        // 구매자 계정에서 추가
        reviewByWriter_mapping[_buyer].push(_tokenId);
        // 판매자 계정에서 삭제
        for(uint i=0; i < reviewByWriter_mapping[_owner].length; i++){
            if(reviewByWriter_mapping[_owner][i] == _tokenId){
                delete reviewByWriter_mapping[_owner][i];
            }
        }

        // Token 보내기;
        reviewCoinAddress.transferFrom(_msgSender(), _owner, _amount);

        // 거래 성사시, price 0으로 초기화;
        Review_mapping[_tokenId].price = 0;

        emit tradeNft_event(_owner, _buyer, _tokenId);
    }
}