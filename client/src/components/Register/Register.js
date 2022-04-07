import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Step_one from "./sections/Step_one";
import Step_two from "./sections/Step_two";
import Step_three from "./sections/Step_three";
import axios from "axios";
import { useAlert } from 'react-alert';
import {useNavigate} from "react-router-dom";

function Register(props) {
    const [RegisterStage, setRegisterStage] = useState(1); // 1단계 ~ 2단계 ~ 3단계;
    const [UserTypeCheck, setUserTypeCheck] = useState(null); // 0=점주 ; 1=일반유저
    const [UserPubKey, setUserPubKey] = useState("");
    const [UserPrivateKey, setUserPrivateKey] = useState("");
    
    //회원가입 State
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Nickname, setNickname] = useState("");
    const [Phone, setPhone] = useState("");
    const [StoreId, setStoreId] = useState("");

    const alert = useAlert();
    const navi = useNavigate();

    useEffect(() => {
        if(props.user.auth){
            alert.error("이미 로그인이 되어있는 유저입니다 ")
            navi('/')
        }
    }, [props.user])


    useEffect(() => {
        // UserType을 선택했다면 2단계로;
        if(UserTypeCheck !== null) {
            setRegisterStage(2);
        }
        if(UserPubKey){
            setRegisterStage(3);
        };
    }, [UserTypeCheck, UserPubKey]);

    //2단계 -> 3단계 진입시, 지갑 중복체크
    useEffect(async() => {
        if(UserPubKey !== ""){
            let payload = {
                element: "accountPubKey",
                content: UserPubKey
            }
            const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/register/overlapcheck", payload, {withCredentials : true})
            if(!result.data.success){
                //중복되었다면?
                setUserPubKey("");
                setUserPrivateKey("");
                setRegisterStage(2);
                alert.error("이미 가입된 지갑주소입니다.");
            }
        }
    }, [UserPubKey])


    const renderingRegisterForm = () => {
        if(RegisterStage === 1){
            return (<Step_one setUserTypeCheck={setUserTypeCheck} />)
        }
        if(RegisterStage === 2){
            return (<Step_two setUserPubKey={setUserPubKey} setUserPrivateKey={setUserPrivateKey} />)
        }
        if(RegisterStage === 3){
            return (
            <Step_three 
                Email={Email}
                setEmail={setEmail}
                Password={Password}
                setPassword={setPassword}
                Nickname={Nickname}
                setNickname={setNickname}
                Phone={Phone}
                setPhone={setPhone}
                UserTypeCheck={UserTypeCheck}
                setUserTypeCheck={setUserTypeCheck}
                UserPubKey={UserPubKey}
                UserPrivateKey={UserPrivateKey}
                StoreId={StoreId}
                setStoreId={setStoreId}
            />)
        }
    }

    return (
        <RegisterContainer>
                <LogoBox>
                    <Img src="https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/logo2.png"/>
                </LogoBox>


                {/* 회원가입 단계에 따라서, 1단계 컴포넌트, 2단계 컴포넌트, 3단계 컴포넌트를 랜더링 하겠다. */}
                <>
                    {renderingRegisterForm()}
                    
                </>
        </RegisterContainer>
    )
}

export default Register;

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LogoBox = styled.div`
    width: 250px;
    height: 250px;
`;

const Img = styled.img`
    width: 100%;
`;

