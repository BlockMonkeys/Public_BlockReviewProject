import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import axios from "axios";
import Modal from './sections/Modal';
import { useAlert } from 'react-alert';

function Login(props) {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [WalletTypeFlag, setWalletTypeFlag] = useState(false);
    const ModalOutside = useRef();
    const alert = useAlert();


    const handleModal = () => {
        if(WalletTypeFlag == true){
            setWalletTypeFlag(false);
        }
    }

    useEffect(() => {
        ModalOutside.current.addEventListener("click", handleModal);
    }, [WalletTypeFlag])

    const submit = () => {
        if(Email == ""){
            alert.error("이메일을 입력해주세요 !")
        }
        if(Password == ""){
            alert.error("패스워드를 입력해주세요 !")
        }
        let payload = {
            email : Email,
            password : Password
        }
        axios.post("https://server.monstercoders.io/api/blockreview/user/findwallettype", payload, {withCredentials : true})
        .then(res => {
            if(res.status !== 200){
              return  alert.error("잠시후 다시 시도해주세요.")
            }
            if(!res.data.success) {
              return  alert.error("유저가 존재하지 않습니다.")
            }
            if(!res.data){
              return  alert.error("유저정보가 일치하지 않습니다!")
            } else {
                if(res.data.payload[0].walletType == 0){
                    axios.post("https://server.monstercoders.io/api/blockreview/user/login", payload , {withCredentials : true})
                    .then(res => {
                        if(res.status === 400){
                            alert.error("잠시후 다시 시도해주세요.");
                        }
                        if(res.data.success){
                            window.location.href = "/"
                            alert.success("로그인 성공!");
                        } else {
                            alert.error("패스워드가 일치하지 않습니다.");
                        }
                    })
                } else {
                    setWalletTypeFlag(true);
                }
            }
        })
    }

    return (
        <>
        <Modal WalletTypeFlag={WalletTypeFlag} setWalletTypeFlag={setWalletTypeFlag} email={Email} password={Password} />
        <LoginContainer ref={ModalOutside} WalletTypeFlag={WalletTypeFlag}>  
                <Img src="https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/logo2.png"/>
                <>
                    <LoginForm>
                        <Input type="email" value={Email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder='이메일을 적어주세요.'/>
                        <Input type="password" value={Password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder='비밀번호를 적어주세요.'/>
                    </LoginForm>
                    <>
                        <Button onClick={submit}>로그인</Button>
                    </>
                </>
        </LoginContainer>
        </>
        
    )
}

export default Login

const Img = styled.img`
    width: 370px;
    height: 370px;
`

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    opacity: ${r => r.WalletTypeFlag ? "0.2" : "1"};
`
const LoginForm = styled.div`
    display: flex;
    flex-direction: column;
    
`
const Input = styled.input`
    width: 380px;
    height: 40px;
    margin-bottom: 15px;
    border: none;
    border-bottom: 1px solid lightgray;
    outline: none;
`
const Button = styled.button`
    margin-top: 20px;
    padding: 13px 0 13px;
    width: 400px;
    color: white;
    background-color: black;
    border-radius: 10px;
    :hover {
        cursor: pointer;
    }

`

