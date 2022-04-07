import React, { useState } from 'react'
import styled from "styled-components";
import { contract_review, sendGSN_tx } from "../../../config-web3";
import axios from "axios";
import DropZone from "../../assets/DropZone";
import { useAlert } from "react-alert";

function OnSaleModal(props) {
    const [UserPrice, setUserPrice] = useState("");
    const [Privatekey, setPrivatekey] = useState(null);

    const alert = useAlert();

    const handleOnSale = async(e) => {
        props.setSpinner_Flag(true);
        // @ 외부지갑 유저 Client GSN 호출
        if(props.user.walletType === 1){
            const tx = contract_review.methods.registerForSale(props.id, UserPrice);
            const onsaleTxResult = await sendGSN_tx(tx, props.user.accountPubKey);
            if(onsaleTxResult.status){
                alert.info("판매등록완료");
                window.location.reload();
            }
            props.setSpinner_Flag(false);
        // @ 내부지갑 유저 Server GSN 호출    
        } else {
            if(Privatekey){
                let payload = {
                    reviewId: props.id,
                    price: UserPrice,
                    pubkey: props.user.accountPubKey,
                    privatekey: Privatekey,
                }
                const onSaleTxResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/sale/onsale", payload, {withCredentials: true});
                if(onSaleTxResult.data.success){
                    alert.info("판매등록완료");
                    window.location.reload();
                }
                props.setSpinner_Flag(false);
            }
        }
    }

    const rendering = () => {
        // JS 로직 작성을 원활하게 하기위해 함수로 빼서 랜더링
        return(
            <>
            {props.review &&
                props.review.map((item, idx)=> {
                    if(item.id == props.id){
                        return(
                        <div key={idx}>
                            <Modal key={idx}>
                                {Privatekey || props.user.walletType === 1 ?
                                <></>
                                :
                                <div>
                                    <DropZone setPrivatekey={setPrivatekey} />
                                </div>
                                }
                                <ContentBox>
                                    <Label>리뷰아이디 : </Label>
                                    <Content>{item.id}</Content>
                                </ContentBox>

                                <ContentBox>
                                    <Label>리뷰제목 : </Label>
                                    <Content>{item.title}</Content>
                                </ContentBox>

                                <ContentBox>
                                    <Label>좋아요 : </Label>
                                    <Content>{item.likedUser.length}</Content>
                                </ContentBox>

                                <Input type="text" placeholder="판매가격 입력" value={UserPrice} onChange={e => setUserPrice(e.currentTarget.value)} />
                                <Btn_Submit onClick={handleOnSale}>판매등록 확정</Btn_Submit>
                                <Btn_Submit onClick={()=> props.setOnSaleFlag(false)}>취소</Btn_Submit>
                            </Modal>
                            </div>
                        )
                    }
                })
            }
            </>
        )
    }

    return (
        <>
            {rendering()}
        </>
    )
}

export default OnSaleModal;

const Modal = styled.div`
    width: 500px;
    height: 500px;
    background-color: ghostwhite;
    border: 1px solid lightgray;
    position : fixed;
    top: 30%;
    left: 35%;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;

const ContentBox = styled.div`
    display: flex;
    margin: 15px 0px;
`;

const Label = styled.label`
    font-weight: 600;
`;

const Content = styled.div`

`;

const Input = styled.input`
    width: 250px;
    font-size: 18px;
    padding: 3px;
    margin: 15px 0px;
`;

const Btn_Submit = styled.button`
    width: 250px;
    height: 50px;
    background-color: ghostwhite;
    border: 1px solid lightgray;
    :hover{
        cursor: pointer;
        opacity: 0.7;
    }
`;




