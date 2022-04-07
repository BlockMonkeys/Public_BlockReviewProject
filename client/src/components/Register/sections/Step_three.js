import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { CSVLink, CSVDownload } from "react-csv";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAlert } from 'react-alert';
import { contract_review, sendGSN_tx } from "../../../config-web3";
import Spinner from "../../assets/Spinner";

function Step_Three(props) {
    const [PasswordCompareFlag, setPasswordCompareFlag] = useState(true);
    const [Verify_Password, setVerify_Password] = useState("");
    const [UserAccept, setUserAccept] = useState(false);
    const [CSVData, setCSVData] = useState([
        ["PrivateKey", "PublicKey"],
        [String(props.UserPrivateKey), String(props.UserPubKey)]
    ]);
    const [UserEmail_Overlap, setUserEmail_Overlap] = useState(false);
    const [UserNickName_Overlap, setUserNickName_Overlap] = useState(false);
    const [Spinner_Flag, setSpinner_Flag] = useState(false);

    const navi = useNavigate();
    const alert = useAlert();

    useEffect(() => {
        comparePassword();
    }, [Verify_Password])

    const comparePassword = () => {
        if(props.Password !== Verify_Password){
            setPasswordCompareFlag(false); //비밀번호가 다름.
        } else {
            setPasswordCompareFlag(true);// 비밀번호가 일치함.
        }
    }
    
    const handleRegisterSubmit = async() => {
        if(props.Email === ""){
            alert.error("이메일을 입력해주세요.");
            return;
        }

        if(props.Password === ""){
            alert.error("비밀번호를 입력해주세요.");
            return;
        }

        if(props.Nickname === ""){
            alert.error("닉네임을 채워주세요.");
            return;
        }

        if(props.Phone === ""){
            alert.error("휴대폰번호를 입력해주세요.");
            return;
        }

        if(props.UserTypeCheck === 0 && props.StoreId === ""){
            alert.error("사업자 등록번호를 입력해주세요.");
            return;
        }
    
        if(props.Password !== Verify_Password){
            alert.error("비밀번호가 일치하지 않습니다.");
            return;
        }

        if(UserEmail_Overlap){
            alert.error("이메일이 중복됩니다.");
            return;
        }

        if(UserNickName_Overlap){
            alert.error("닉네임이 중복됩니다.")
            return;
        };
        
        // Spinner 출력;
        setSpinner_Flag(true);

        try {
            const payload = {
                email : props.Email,
                password : props.Password,
                phone : props.Phone,
                role : props.UserTypeCheck,
                nickname : props.Nickname,
                pubkey : props.UserPubKey,
                privatekey : props.UserPrivateKey,
                storeId : props.StoreId,
            }
            // 1.props.UserPrivateKey가 없다면, 외부지갑유저 = Client GSN을 호출하고, 서버 API를 호출.
            if(!props.UserPrivateKey){
                alert.info("서명해주세요 👉🏻");
                const contract_gsnApprove = await contract_review.methods.approveForGSN(100000000);
                const contract_nftApprove = await contract_review.methods.approveForNFT(props.UserPubKey);
                await sendGSN_tx(contract_gsnApprove, props.UserPubKey);
                await sendGSN_tx(contract_nftApprove, props.UserPubKey);
            }
            // 2. Register API
            const registerResult = await axios.post("https://server.monstercoders.io/api/blockreview/user/register", payload, {withCredentials : true});
            if(registerResult.data.success){
                alert.success("회원가입완료!")
                navi("/user/login");
            }
        } catch (err) {
            alert.error(`잠시 후 다시 시도해주세요 😭 : ${err}`);
        } finally {
            //Spinner 종료;
            setSpinner_Flag(false);
        }
    }

    const handleEmailCheck = async(e) => {
        let payload = {
            element: "email",
            content: props.Email
        };
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/register/overlapcheck", payload, {withCredentials : true})
        if(!result.data.success){
            setUserEmail_Overlap(true);
        } else {
            setUserEmail_Overlap(false);
        }
    }
    
    const handleNickNameCheck = async(e) => {
        let payload = {
            element: "nickname",
            content: props.Nickname
        };
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/register/overlapcheck", payload, {withCredentials : true})
            if(!result.data.success){
                setUserNickName_Overlap(true);
            } else {
                setUserNickName_Overlap(false);
            }
    }

    return (
        // Normal User Form;
        <RegisterForm>
            {Spinner_Flag ?
                <div>
                    <Spinner />
                </div>
            :
            <>
            {!props.UserPrivateKey &&
                <div style={{ color: "red", textAlign: "center" }}>⚠️ 외부지갑유저는 Metamask 승인 2회를 거칩니다. (GSN사용권한, NFT사용권한)</div>
            }
            <InputBox>
                <Label> 지갑주소 : </Label>
                <Input type="text" value={props.UserPubKey} placeholder="Public Key" disabled/>
            </InputBox>
            <InputBox>
                <Label>이메일(아이디) : </Label>
                <Input type="email" value={props.Email} onChange={e => props.setEmail(e.currentTarget.value)} placeholder="Email" onBlur={handleEmailCheck} />
                <PWWarning>{UserEmail_Overlap ? "이메일이 중복됩니다." : "" }</PWWarning>
            </InputBox>

            <InputBox>
                <Label>비밀번호 : </Label>
                <Input type="password" value={props.Password} onChange={e => props.setPassword(e.currentTarget.value)} placeholder="Password" />
            </InputBox>

            <InputBox>
                <Label>비밀번호확인 : </Label>
                <Input type="password" value={props.Verify_Password} onChange={e => setVerify_Password(e.currentTarget.value)} placeholder="Verify Password" />
            </InputBox>
            <InputBox>
                <PWWarning>{PasswordCompareFlag ? "" : "비밀번호가 일치하지 않습니다." }</PWWarning>
            </InputBox>

            <InputBox>
                <Label>닉네임 : </Label>
                <Input type="text" value={props.Nickname} onChange={e => props.setNickname(e.currentTarget.value)} placeholder="Nickname" onBlur={handleNickNameCheck}/>
                <PWWarning>{UserNickName_Overlap ? "닉네임이 중복됩니다." : "" }</PWWarning>
            </InputBox>

            <InputBox>
                <Label>휴대폰번호 : </Label>
                <Input type="text" value={props.Phone} onChange={e => props.setPhone(e.currentTarget.value)} placeholder="휴대폰번호 ('-'없이 숫자만작성하세요)" />
            </InputBox>

            {props.UserTypeCheck === 0 &&
                <InputBox>
                    <Label>사업자등록번호 : </Label>
                    <Input type="text" value={props.StoreId} onChange={e => props.setStoreId(e.currentTarget.value)} placeholder="사업자등록번호" />
                </InputBox>
            }

            {/* if UserPrivateKey 가 있다면, 회원가입완료버튼은 CSV 파일 다운로드 이후, 활성화 */}
            <SubmitBtnBox>
                <WarningText>반드시 아래 다운로드 버튼을 눌러 개인의 키 정보를 가져가십시오.</WarningText>
                <WarningText>분실에 대한 책임은 개인에게 있으며 분실시 계정에 대한 어떠한 책임도 질 수 없습니다.</WarningText>
                <WarningText>동의하십니까? <span><input type="checkbox" checked={UserAccept} onChange={e=> setUserAccept(!UserAccept)}/></span></WarningText>
                
                
                {UserAccept ? 
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                        
                        {props.UserPrivateKey === "" ?
                        <></>
                        :
                        <>
                        <CSVDownload data={CSVData} />
                        <CSVLink data={CSVData}>EOA 다운로드</CSVLink>
                        </>
                        }
                        <SubmitBtn onClick={handleRegisterSubmit}>회원가입완료</SubmitBtn>
                    </div>
                :
                <></>
                } 
            </SubmitBtnBox>
            </>
            }
 
        </RegisterForm>

    )
}

export default Step_Three;

const blinkAnimation = keyframes`
    from{
        opacity:1;
    }
    to {
        opacity:0;
    }
`;

const RegisterForm = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    width: 450px;
    height: 40px;
    margin-bottom: 15px;
    border: none;
    border-bottom: 1px solid lightgray;
    outline: none;
`;

const SubmitBtnBox = styled.div`
    text-align: center;
`;

const SubmitBtn = styled.button`
    margin-top: 20px;
    padding: 13px 0 13px;
    width: 400px;
    color: white;
    font-weight: 800;
    background-color: black;
    border-radius: 10px;
    :hover {
        cursor: pointer;
    }
`;

const PWWarning = styled.div`
    color: red;
    text-align: center;
    animation : ${blinkAnimation} .5s infinite ease-in-out;
`;

const Label = styled.label`
    display: inline-block;
    width: 140px;
    font-weight: 600;
`;

const InputBox = styled.div`
    text-align: left;
`;

const WarningText = styled.div`
    color: red;
    font-weight: 600;
`;