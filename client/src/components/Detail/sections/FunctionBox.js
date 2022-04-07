import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import { LikeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { contract_review, sendGSN_tx } from "../../../config-web3";
import axios from "axios";
import DropZone from "../../assets/DropZone";
import Spinner from "../../assets/Spinner";
import { useAlert } from 'react-alert';
import { useNavigate } from "react-router-dom";

function FunctionBox(props) {
    const [Privatekey, setPrivatekey] = useState("");
    const [Modal_Flag, setModal_Flag] = useState(false);
    const [UserSelect, setUserSelect] = useState(0); // 1 = Like Action && 2 = Buy Action
    const [Spinner_Flag, setSpinner_Flag] = useState(false);
    const [LikedUser_Flag, setLikedUser_Flag] = useState(true);
    const alert = useAlert();
    const navi = useNavigate();


    useEffect(async() => {
        if(Privatekey){
            setSpinner_Flag(true);
            // @ Like Action
            if(UserSelect === 1) {
                setModal_Flag(false);
                const payload = {
                    pubkey : props.account,
                    privatekey: Privatekey
                }
                const LikeReviewResult = await axios.post(`https://server.monstercoders.io/api/blockreview/review/like/${props.id}`, payload, {withCredentials : true});
                if(LikeReviewResult.status){
                    alert.success("좋아요 성공!");
                }
                setSpinner_Flag(false);
                setUserSelect(0);
            }
            // @ Buy Action
            if(UserSelect === 2){
                setModal_Flag(false);
                const payload = {
                    reviewId : props.id,
                    email: props.user.email,
                    pubkey_buyer: props.account,
                    privatekey_buyer: Privatekey,
                }
                const TradeReviewResult = await axios.post(`https://server.monstercoders.io/api/blockreview/review/sale/trade`, payload, {withCredentials : true});
                if(TradeReviewResult.status){
                    alert.success("구매 성공");
                }
                setSpinner_Flag(false);
                setUserSelect(0);
            }
        }
    }, [Privatekey]);
    

    useEffect(() => {
        if(props.review.likedUser){
            // @ 사용자가 좋아요 누른 목록에 존재하는가?
            props.review.likedUser.map((item, idx)=> {
                if(item === props.user.accountPubKey){
                    //이미 좋아요한 유저다.
                    setLikedUser_Flag(false);
                };
            });
        }
    }, [props.review]);

    // Review NFT 구매
    const handleBuy = async () => { 
        const price = Number(props.review.price);
        // @ 판매중인 리뷰 확인;
        if(props.review.price == 0) {
            return;
        } else {
            // @ 구매자가 작성자인지 확인;
            if(props.review.writer === props.account) {
                alert.error("구매자는 본인의 리뷰를 구매할 수 없습니다.");
                navi(`/store/${props.review.category}/${props.id}`);
                return;
            }

            if(window.confirm(`${price} Token이 글쓴이에게 전송됩니다. 계속하시겠습니까?`) === true){
                if(props.user.walletType === 1){
                    setSpinner_Flag(true);
                    // 외부월렛 사용자 Client GSN 호출
                    const tx = await contract_review.methods.saleNFT(props.review.writer, props.account, props.id, props.review.price);
                    const result = await sendGSN_tx(tx, props.account);
                    if(result.status){
                        const payload = {
                            reviewId : props.id,
                            email: props.user.email,
                            pubkey_buyer: props.account,
                            privatekey_buyer: Privatekey,
                        }
                        const TradeReviewResult = await axios.post(`https://server.monstercoders.io/api/blockreview/review/sale/trade`, payload, {withCredentials : true});
                        if(TradeReviewResult.data.success){
                            alert.success(`구매완료.`);
                            navi(`/store/${props.review.category}/${props.id}`, {replace : true});
                        } else {
                            alert.error(`잠시후 다시 시도해주세요.`)
                        }
                        setSpinner_Flag(false);
                    }
                } else {
                    // 내부월렛 사용자 Server GSN 호출 => 모달을 통해 User Private Key를 받으시오.
                    setUserSelect(2);
                    setModal_Flag(true);
                    alert.info("키파일을 넣어주세요.");
                }
            }
        }
    }

    // 좋아요.
    const handleLike = async () => {
        if(!LikedUser_Flag){
            return;
        } else {
            const price = 100;
            const adminAccount = "0xB28333cab47389DE99277F1A79De9a80A8d8678b";
            // @ Confirm   
            if(window.confirm(`${price} Token이 글쓴이에게 전송됩니다. 계속하시겠습니까?`) === true){
                // @ 요청자가 글쓴이인가?
                if(props.review.writer === props.user.accountPubKey){
                    //요청자는 글쓴이다. 튕겨라
                    alert.error("자기글에는 좋아요를 할 수 없습니다.");
                    navi(`/store/${props.review.category}/${props.id}`, {replace : true});
                    return;
                } else {
                    // @외부월렛 사용자 및 내부월렛 사용자
                    if(props.user.walletType === 1) {
                        setSpinner_Flag(true);
                        try {
                            //외부월렛 사용자 Client GSN 호출
                            const tx = await contract_review.methods.createLiked(props.id, adminAccount, price);
                            const result = await sendGSN_tx(tx, props.account);
                            if(result.status){
                                alert.success(`좋아요 완료! ${result.transactionHash}`);
                                navi(`/store/${props.review.category}/${props.id}`, {replace : true}); 
                            }
                        } catch (err) {
                            alert.error(`Gas Station Network ERR : ${err}`)
                        } finally {
                            setSpinner_Flag(false);
                        }
                    } else {
                        if(Privatekey === ""){
                            // 모달을 열어 파일을 받으시오.
                            setUserSelect(1);
                            setModal_Flag(true);
                            alert.info("키파일을 넣어주세요.");
                        }
                    }

                }    
            }
        }
    }

    return (
        <>
        {Spinner_Flag &&
            <div style={{ position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
                <Spinner />
            </div>
        }
            <FunctionalBox flag={Spinner_Flag}>
                {Modal_Flag ?
                    <DropZone Privatekey={Privatekey} setPrivatekey={setPrivatekey} />
                    :
                    <>
                    <Buy_Btn flag={props.review.price} onClick={handleBuy}>
                        <ShoppingCartOutlined />
                        <Btn_des>구매하기</Btn_des>
                    </Buy_Btn>

                    <Like_Btn flag={LikedUser_Flag} onClick={handleLike}>
                        <LikeOutlined/>
                        {props.review.title &&
                            <Btn_des>{props.review.likedUser.length}</Btn_des>
                        }
                    </Like_Btn>
                    </>
                }
            </FunctionalBox>
        </>
        
    )
}

export default FunctionBox

const FunctionalBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    opacity: ${r => r.flag ? "0.3":"1"};
`;

const Buy_Btn = styled.div`
    background-color: ${r => r.flag == 0 ? "gray":"whitesmoke"};
    width: 100px;
    display: flex;
    justify-content: center;
    border: 1px solid gray;
    padding: 5px;
    user-select: none;
    :hover{
        opacity: ${r => r.flag == 0 ? "1":"0.8"};
        cursor: ${r => r.flag == 0 ? "not-allowed":"pointer"};
    }
`;

const Like_Btn = styled.div`
    background-color: ${r => r.flag == 0 ? "gray":"whitesmoke"};
    width: 100px;
    display: flex;
    justify-content: center;
    border: 1px solid gray;
    padding: 5px;
    user-select: none;
    :hover{
        opacity: ${r => r.flag == 0 ? "1":"0.8"};
        cursor: ${r => r.flag == 0 ? "not-allowed":"pointer"};
    }
`;

const Btn_des = styled.span`
    line-height: 16px;
    margin-left: 5px;
`;
