import React,{ useEffect, useState } from 'react';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import EventBar from './sections/EventBar';
import axios from "axios";

function Header() {
    const [LoginFlag, setLoginFlag] = useState(false);
    const [Pubkey, setPubkey] = useState("");
    const navi = useNavigate();

    const handle_Route = (e) => {
        const routeAddress = `${e.target.className.split(" ")[2]}`;
        navi(routeAddress);        
    }

    useEffect( async() => {
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/auth", {}, {withCredentials: true})
        if(!result.data.success) {
            setLoginFlag(false);
        } else {
            setPubkey(result.data.accountPubKey);
            setLoginFlag(true);
        }
    }, [])


    const goHome = async() => {
        navi("/");
    }
    
    const goMonCoHome = () => {
        window.location.href = "https://www.monstercoders.io/"
    }

    const logout = async() => {
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/logout", {}, {withCredentials: true})
        if(result.data.success){
            window.location.href = "/";
        } else {
            alert.error("일시적인 오류로 실패했습니다");
        }
    }


    return (
        <>
            <Header__Menu>
                
                <Btn flag={false} className="/store/register" onClick={handle_Route}>RegisterStore</Btn>
                <Btn flag={false} className="/user/register" onClick={handle_Route}>RegisterUser</Btn>
                <LogoBox onClick={goHome}>
                    <Logo src="https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/logo.png" />
                </LogoBox>
               {LoginFlag  ?   
                <>
                    <Btn flag={false} onClick={() => navi(`/user/mypage/${Pubkey}`)}>MyPage</Btn>
                    <Btn flag={false} onClick={logout}>Logout</Btn>
                </>
                 :  
                <>
                    <Btn flag={false} className="/user/login" onClick={handle_Route}>Login</Btn>
                    <Btn flag={false} onClick={goMonCoHome}>ContactUs</Btn>
                </>
                }
                
            </Header__Menu>
            <EventBar/>
        </>
    )
}

export default Header;


const Header__Menu = styled.div`
    width: 100%;
    background-color: black;
    height: 30vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
`;


const Btn = styled.div`
    width: 200px;
    line-height: 30px;
    height: 30px;

    color: ${props => props.flag ? "red":"white"};
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    font-family: 'Bebas Neue', cursive;
    user-select: none;

    &:hover{
        cursor: pointer;
        font-weight: 600;
    }
`;

const LogoBox = styled.div`
    margin-top: 10px;
    user-select: none;
    &:hover{
        cursor: pointer;
        transform:scale(1.1);
    }
`;

const Logo = styled.img`
    width: 60px;
`;
