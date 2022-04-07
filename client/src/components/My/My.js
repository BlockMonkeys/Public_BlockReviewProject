import axios from 'axios';
import React, {useState ,useEffect } from 'react';
import styled from 'styled-components';
import { web3, contract_coin, contract_review } from "../../config-web3";
import UserInfo from "./section/UserInfo";
import ReviewForm from "./section/ReviewForm";
import Spinner from "../assets/Spinner";
import { useAlert } from "react-alert";

function My(props) {
    const [TokenName, setTokenName] = useState("")
    const [Review, setReview] = useState([]);
    const [EthBalance, setEthBalance] = useState(0);
    const [TokenBalance, setTokenBalance] = useState(0);
    const [Spinner_Flag, setSpinner_Flag] = useState(false);
    const alert = useAlert();

    useEffect(async() => {
        setSpinner_Flag(true)
        if(props.user.auth){
                const TokenName = await contract_coin.methods.name().call();
                setTokenName(TokenName)
                const balance = await contract_coin.methods.balanceOf(props.user.accountPubKey).call();
                setTokenBalance(balance);
                const balance_eth_wei = await web3.eth.getBalance(props.user.accountPubKey);
                const balance_eth = web3.utils.fromWei(balance_eth_wei, "ether");
                setEthBalance(balance_eth);
                let payload = {
                    pubkey : props.user.accountPubKey
                }
                const result = await axios.post("https://server.monstercoders.io/api/blockreview/review/read/owner", payload, { withCredentials : true })
                setReview(result.data.payload);
                setSpinner_Flag(false);
        }
    }, [props.user]);

    const handleFaucet = async() => {
        setSpinner_Flag(true)
        const payload = {
            sendTo: props.user.accountPubKey
        }

        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/faucet", payload, { withCredentials : true });
        if(result.data.success){
            alert.success("BRC 지급 성공");
        } else {
            alert.error("이미 사용한 유저입니다.");
        }
        setSpinner_Flag(false);
    }

    return (
        <MyPage>
            {Spinner_Flag ?
                <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Spinner />
                </div>
            :
            <>  
                <div>
                    <button onClick={handleFaucet}>Faucet</button>
                </div>

                <UserInfo 
                    account={props.account}
                    user={props.user}
                    tokenName={TokenName}
                    tokenBalance={TokenBalance}
                    ethBalance={EthBalance}
                />

                <ReviewForm 
                    review={Review} 
                    user={props.user}
                />
            
            </>
            }
        </MyPage>  
    )
}

export default My;

const MyPage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;