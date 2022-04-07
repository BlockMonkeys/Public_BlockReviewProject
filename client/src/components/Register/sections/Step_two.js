import React from 'react'
import styled from "styled-components";
import Scab from "../../assets/Scab";
import axios from "axios";
import MetamaskImg from "../../assets/img/metamask.png";
import { wallet_metamask, web3, wallet_walletConnect_disconnect} from "../../../config-web3";
import { useAlert } from 'react-alert';

function Step_Two(props) {
    const alert = useAlert();

    const createWallet = () => {
        axios.get("https://server.monstercoders.io/api/blockreview/user/eoa/create", {withCredentials : true})
            .then(res => {
                if(!res.data.success){
                    alert.error("일시적 서버 오류입니다. 잠시후 다시 시도해주세요!");
                    return;
                }
                props.setUserPubKey(res.data.payload.address);
                props.setUserPrivateKey(res.data.payload.privateKey);
            });
    }


    const connectExternalWallet_Metamask = async() => {
        // 메타마스크 연결
        await wallet_metamask();
        // Get PubKey
        const getPubKey = await web3.eth.getAccounts();
        if(getPubKey[0]){
            props.setUserPubKey(getPubKey[0]);
        }
    }
    
    return (
        // 자체월렛 또는 외부월렛 생성하기.
        // 자체월렛 = 월렛 생성 API 호출;
        // 개인유저 & 점주유저 확인;
        <Container>
            <TextContent>
            <div>연결할 지갑을 선택해주세요.</div>
                    <div>만약 설치된 지갑이 없다면 
                        <LinkText onClick={()=> window.open("https://metamask.io/", "_blank")}> 이곳 </LinkText>
                    을 참조해주세요.
                    </div>
                    <div>만약 우리사이트에서 다른 지갑을 연결한 기록이 있다면 <LinkText onClick={()=> {
                        wallet_walletConnect_disconnect();
                        window.location.reload();
                        alert.info("연결이 해제되었습니다 계속 진행해주세요.🙂")
                    }}>연결해제</LinkText>를 클릭해주세요!</div>
            </TextContent>
            
            <ScabContainer>
                <Scab name="월렛자동생성" img="https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/walleticon.png" handleClick={createWallet}/>
                <Scab name="메타마스크" img={MetamaskImg} handleClick={connectExternalWallet_Metamask}/>
            </ScabContainer>
        </Container>
    )
}

export default Step_Two


const Container = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 50px;
    border: 1px solid lightgray;
`;

const TextContent = styled.div`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 100px;
`;

const ScabContainer = styled.div`
    display:flex;
    justify-content: space-around;
`;
const LinkText = styled.span`
    color: blue;
    font-size: 18px;
    font-weight: 600;
    :hover{
        cursor: pointer;
    }
`;

