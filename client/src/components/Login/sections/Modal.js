import React from 'react';
import styled from 'styled-components';
import { wallet_walletConnect_disconnect, wallet_metamask} from "../../../config-web3";
import Scab from "../../assets/Scab";
import MetamaskImg from "../../assets/img/metamask.png";
import axios from "axios";

import { useAlert } from "react-alert";

function Modal(props) {
    const alert = useAlert();
    
    //@ Login
    const Login = () => {
        if(localStorage.getItem("walletconnect") == null){
            alert.error("연결된 지갑이 없습니다.");
        } else {
            let payload = {
                pubkey : JSON.parse(localStorage.getItem("walletconnect")).accounts[0],
                email : props.email,
                password : props.password
            }
            axios.post("https://server.monstercoders.io/api/blockreview/user/matchingpubkey", payload , {withCredentials : true})
            .then(res => {
                if(!res.data.success) {
                    alert.error("기존의 있던 pubkey와 일치하지 않습니다 ! 기존의 지갑과 연결해주세요!")
                } else {
                    axios.post("https://server.monstercoders.io/api/blockreview/user/login", payload , {withCredentials : true})
                        .then(res => {
                            if(res.data.success){
                                alert.success("로그인 성공!")
                                window.location.href = "/"
                                
                            } else {
                                alert.error("로그인실패! 패스워드와 이메일을 다시 확인해주세요 !")
                                props.setWalletTypeFlag(false);
                            }
                        })
                    }
                })
            }
        };

    //지갑연결
    const Wallet_Metamask = async() => {
        await wallet_metamask()
        await Login();
    }
    return (
        <>
        <ModalContainer flag={props.WalletTypeFlag}>
                <div>연결할 지갑을 선택해주세요.</div>
                <div>만약 설치된 지갑이 없다면 
                    <LinkText onClick={()=> window.open("https://metamask.io/", "_blank")}> 이곳 </LinkText>
                을 참조해주세요.
                </div>
                <div>만약 우리사이트에서 다른 지갑을 연결한 기록이 있다면 <LinkText onClick={()=> {
                    wallet_walletConnect_disconnect();
                    alert("연결이 해제되었습니다 계속 진행해주세요.🙂")
                }}>연결해제</LinkText>를 클릭해주세요!</div>
                <WalletConnect>
                    <Scab name="Metamask" img={MetamaskImg} handleClick={Wallet_Metamask}/>
                </WalletConnect>
            </ModalContainer>
       </>
    )
}

export default Modal;


const ModalContainer = styled.div`
    position: absolute;
    display: ${r => r.flag ? "flex" : "none"};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-height: 80%;
    width: 550px;
    height: 50%;
    padding: 16px;
    background: white;
    border-radius: 10px;
    border: 1px solid lightgray;
    z-index: 3;
    `
const WalletConnect = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding: 50px;
`;

const LinkText = styled.span`
color: blue;
font-size: 18px;
font-weight: 600;
:hover{
    cursor: pointer;
}
`;
