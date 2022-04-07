import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { contract_review, sendGSN_tx } from "../../../config-web3";
import OnSaleModal from "./OnSaleModal";
import axios from "axios";
import Dropzone from "../../assets/DropZone";
import { useAlert } from "react-alert";
import Spinner from "../../assets/Spinner";
import { useNavigate } from "react-router-dom";

function ReviewForm(props) {
    const [OnSaleFlag, setOnSaleFlag] = useState(false);
    const [Item, setItem] = useState(null);
    const [Privatekey, setPrivatekey] = useState(null);
    const [Modal_Flag, setModal_Flag] = useState(false);
    const [Spinner_Flag, setSpinner_Flag] = useState(false);
    const navi = useNavigate();
    const alert = useAlert();
    const getCurrentId = (e) => {
        setItem(e.currentTarget.parentNode.id);
        setOnSaleFlag(!OnSaleFlag)
    }

    const offSale = async(e) => {
        setItem(e.currentTarget.parentNode.id);
        if(props.user.walletType === 1){
            setSpinner_Flag(true);
            // @외부지갑유저
            const tx = await contract_review.methods.withdrawFromSale(e.currentTarget.parentNode.id);
            const offSaleTxResult = await sendGSN_tx(tx, props.user.accountPubKey);
            if(offSaleTxResult.status){
                setSpinner_Flag(false);
                alert.info("판매철회완료");
                navi(`/user/mypage/${props.user.accountPubKey}/`, {replace : true});
                return;
            }
            setSpinner_Flag(false);
        } else {
            // @내부지갑유저
            setModal_Flag(true);
        }
    }

    useEffect(async() => {
        if(Privatekey) {
            setSpinner_Flag(true);
            setModal_Flag(false);
            //서버로 offSale
            const payload = {
                "reviewId": Item,
                "pubkey": props.user.accountPubKey,
                "privatekey": Privatekey
            };

            const txResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/sale/offsale", payload, { withCredentials: true });
            if(txResult.status){
                //ALERT;
                setSpinner_Flag(false);
                alert.info("판매철회완료");
                navi(`/user/mypage/${props.user.accountPubKey}/`, { replace : true });
                return;
            }
            setSpinner_Flag(false);  
        }
    }, [Privatekey]);
    
    const openNft = async (e) => {
        const id = e.currentTarget.id;
        const result = await contract_review.methods.getNftTokenUri(id).call();
        let uri = result;
        const res = await axios({ url: `https://server.monstercoders.io/ipfs/${uri}`, method: "GET" }, { "Content-Type": "text/plain" }, { withCredentials: "true" });
        if(res.status){
            window.open(`https://server.monstercoders.io/ipfs/${res.data.image}`, "_blank");
        } else {
            alert.error("정상적인 NFT가 아닙니다.");
        }
    }


    return (
        <Container>
            <Title style={{ textAlign: "center" }} flag={Spinner_Flag}>나의 리뷰</Title>
            {Spinner_Flag &&
                <div style={{ position: "fixed", top: "45%", left: "50%"}}>
                    <Spinner />
                </div>
            }
                <Table flag={Spinner_Flag}>
                    {/* Head */}
                    <Thead>
                        <Thead_div>ID</Thead_div>
                        <Thead_div>Title</Thead_div>
                        <Thead_div>Liked</Thead_div>
                        <Thead_div>Price</Thead_div>
                        <Thead_div>창출수익</Thead_div>
                        <Thead_div>판매등록</Thead_div>
                        <Thead_div>판매철회</Thead_div>
                    </Thead>

                {props.review.length > 0 ?
                    props.review.map((item, idx)=> (
                        <Tbody key={idx} id={item.id}>
                            <>
                                <Tbody_div id={item.id} onClick={openNft}>{item.id}</Tbody_div>
                                <Tbody_div id={item.id} onClick={openNft}>{item.title}</Tbody_div>
                                <Tbody_div id={item.id} onClick={openNft}>{item.likedUser.length}</Tbody_div>
                                <Tbody_div id={item.id} onClick={openNft}>{Number(item.price) ? item.price : "미판매"}</Tbody_div>
                                <Tbody_div id={item.id} onClick={openNft}>{(item.likedUser.length * 100) * 0.8} BRC</Tbody_div>
                                <Tbody_div id={item.id}>
                                {OnSaleFlag &&
                                    <div key={idx} style={{ position: "fixed", width: "100vw", height: "100vh" }}>
                                        <OnSaleModal setSpinner_Flag={setSpinner_Flag} Spinner_Flag={Spinner_Flag} key={idx} id={Item} user={props.user} review={props.review} setOnSaleFlag={setOnSaleFlag} />
                                    </div>
                                }
                                    <FunctionalBtn onClick={getCurrentId}>등록</FunctionalBtn>
                                </Tbody_div>
                                <Tbody_div id={item.id}>
                                    {Modal_Flag &&
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "ghostwhite", position: "fixed", width: "250px", height: "200px", top: "40%", right: "10px"}}>
                                        <Dropzone setPrivatekey={setPrivatekey} />
                                    </div>
                                    }
                                    <FunctionalBtn onClick={offSale}>철회</FunctionalBtn>
                                </Tbody_div>
                            </>
                        </Tbody>
                    ))
                :
                <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div>작성된 리뷰가 없습니다.</div>
                </div>
                }
            </Table>
        </Container>   
    )
}


export default ReviewForm;

const Container = styled.div`
    width: 81%;
    margin-top: 20px;
`;

const Title = styled.h1`
    opacity: ${r => r.flag ? "0.1":"1"};
`;

const Table = styled.div`
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
    border: 1px solid lightgrey;
    opacity: ${r => r.flag ? "0.1":"1"};
`;

const Thead = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80px;
    font-weight: 600;
    border-bottom: 1px solid gray;
`;

const Thead_div = styled.div`
    text-align: center;
    :nth-child(1){
        width: 5%;
    }
    :nth-child(2){
        width: 20%;
    }
    :nth-child(3){
        width: 10%;
    }
    :nth-child(4){
        width: 20%;
    }
    :nth-child(5){
        width: 20%;
    }
    :nth-child(6){
        width: 12.5%;
    }
    :nth-child(7){
        width: 12.5%;
    }
`;

const Tbody = styled.div`
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    :hover {
        background-color: lightgrey;
        cursor: pointer;
    }
`;

const Tbody_div = styled.div`
    text-align: center;
    :nth-child(1){
        width: 5%;
    }
    :nth-child(2){
        width: 20%;
    }
    :nth-child(3){
        width: 10%;
    }
    :nth-child(4){
        width: 20%;
    }
    :nth-child(5){
        width: 20%;
    }
    :nth-child(6){
        width: 12.5%;
    }
    :nth-child(7){
        width: 12.5%;
    }
`;


const FunctionalBtn = styled.button`
    background-color: ghostwhite;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    :hover{
        cursor:pointer;
        opacity: 0.6;
    }
`;