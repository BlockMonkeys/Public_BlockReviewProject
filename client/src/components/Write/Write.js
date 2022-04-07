import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { contract_review, sendGSN_tx } from "../../config-web3";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from 'react-alert';
import Spinner from "../assets/Spinner";
import DropZone from "../assets/DropZone";
import html2canvas from "html2canvas";
import WriteCanvas from "./section/WriteCanvas";

function Write(props) {
    const navi = useNavigate();
    const { category } = useParams();
    const [Title, setTitle] = useState("");
    const [Des, setDes] = useState("");
    const [SpinnerFlag, setSpinnerFlag] = useState(false);
    const [PrivateKey, setPrivateKey] = useState("");
    const [CanvasFlag, setCanvasFlag] = useState(false);
    const [ModalFlag, setModalFlag] = useState(false);
    const [InnerFlag, setInnerFlag] = useState(false);

    const alert = useAlert();

    useEffect(() => {
        if(CanvasFlag){
            if(props.user.walletType == 0){
                setModalFlag(true)
            } else {
                outerWalletUserSubmit();
            }
        }
        setCanvasFlag(false);
    }, [CanvasFlag])
    
    useEffect(() => {
           if(PrivateKey.length > 0){
                setCanvasFlag(true);
                setModalFlag(false);
                setInnerFlag(true);
           }
    }, [PrivateKey])

    useEffect(() => {
        if(InnerFlag){
            InnerWalletUserSubmit();
        }
        setCanvasFlag(false);
    }, [InnerFlag])


    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0){
            byteString = atob(dataURI.split(',')[1]);
        }
        else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        // 마임타입 추출
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    const MakeCaputre = async() => {
        const MakeCapture = await html2canvas(document.getElementById("canvas"))
        let formData = new FormData();
        if(MakeCapture){
                formData.append("file", dataURItoBlob(MakeCapture.toDataURL('image/png')));
                formData.append("title", new Blob([JSON.stringify(Title)], {type: "application/json"}));
                formData.append("description", new Blob([JSON.stringify(Des)], {type: "application/json"}));
        }
        return formData;
    }

    const submit = () => {
        setCanvasFlag(true);
    }

    const InnerWalletUserSubmit = async () => {
        const FormData = await MakeCaputre();
        if(props.user.length < 1){
            alert.error("로그인 후 이용해주세요")
            navi(`/user/login`)
        } else {
            if(!Title || !Des || !FormData ) {
                alert.error('항목을 모두 채워주세요.');
            } else {
                setSpinnerFlag(true);
                let ipfsResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/upload/ipfs", FormData , { withCredentials : true })
                //글쓰기 로직
                let payload = {
                    title : Title,
                    des : Des,
                    creator : props.user.email,
                    pubkey : props.user.accountPubKey,
                    privateKey : PrivateKey,
                    category : category,
                    nftUri : ipfsResult.data.payload[0].hash
                }
                //자체월렛 사용자.
                let CreateResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/create", payload, {withCredentials :true})
                if(CreateResult.data.success){
                    alert.success("글쓰기에 성공했습니다!")
                    navi(`/store/${category}`)
                } else {
                    alert.error("글쓰기에 실패했습니다. 잠시후 다시 시도해주세요!");
                    navi(`/store/${category}`)
                }
            } 
        }
    };

    const outerWalletUserSubmit = async() => {
        const FormData = await MakeCaputre();
        if(props.user.length < 1){
            alert.error("로그인 후 이용해주세요")
            navi(`/user/login`)
        } else {
            if(!Title || !Des || !FormData ){
                alert.error('항목을 모두 채워주세요.');
            } else {
                setSpinnerFlag(true);
                let ipfsResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/upload/ipfs", FormData , {withCredentials : true});
                let payload = {
                    title : Title,
                    des : Des,
                    creator : props.user.email,
                    pubkey : props.user.accountPubKey,
                    privatekey : PrivateKey,
                    category : category,
                }
                //선 트랜잭션
                let tx = await contract_review.methods.createReview(Title, Des, "0xB28333cab47389DE99277F1A79De9a80A8d8678b", 1000, props.user.accountPubKey, ipfsResult.data.payload[0].hash, category);
                const result = await sendGSN_tx(tx, props.user.accountPubKey);
                //트랜잭션 성공시 > MYSQL DB 삽입
                if(result){
                let CreateResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/create", payload, {withCredentials : true})
                if(CreateResult.data.success){
                    alert.success("글쓰기에 성공했습니다!")
                    navi(`/store/${category}`)
                } else {
                    alert.error("글쓰기에 실패했습니다. 잠시후 다시 시도해주세요!");
                    navi(`/store/${category}`)
                    }
                }
            }
        }
    };


    const cancel = () => {
        if(window.confirm("취소된 글은 저장되지 않습니다. 취소하시겠습니까?") === true){
            navi(`/store/${category}/`, {replace : true});
        } else {
            return false;
        }
    }

    const LandingbyProgress = () => {
            if(CanvasFlag == true){
                return (
                    <div id="canvas">
                        <WriteCanvas 
                        account = {props.user.accountPubKey}
                        title = {Title}
                        des = {Des}
                        SpinnerFlag = {SpinnerFlag}
                        />
                    </div>
                )
            } else {
                return (
                    <>
                    {SpinnerFlag && 
                        <div style={{position: "fixed", width: "100%", margin: "0 auto", left: "43%", top: "40%"}}>
                            <Spinner />
                        </div>
                    }
                        <BigContainer SpinnerFlag={SpinnerFlag}>
                                {/* <div>
                                    {PrivateKey && 
                                    <div>{PrivateKey}</div>
                                    }
                                    
                                </div> */}
                            <h1 style={{"marginBottom" : "50px"}}>글쓰기</h1>
                            <div>
                                <div style={{"textAlign" : 'center' }}>카테고리</div>
                                <input type="text" value={category} disabled />
                            </div>
                            <MiddleContainer>
                                <TitleBox type="text" placeholder='제목을 입력해주세요' value={Title} onChange={(e) => setTitle(e.currentTarget.value)}/>
                                <DesBox placeholder='본문을 입력해주세요' value={Des} onChange={(e) => setDes(e.currentTarget.value)}/>
                            </MiddleContainer>
                            <ButtonContainer>
                                { ModalFlag ?
                                    <DropZoneForm><DropZone setPrivatekey={setPrivateKey}/></DropZoneForm>
                                    :
                                    <ButtonForm>
                                        <ButtonSubmit onClick={submit}>글 쓰기</ButtonSubmit>
                                        <ButtonSubmit onClick={cancel}>취소</ButtonSubmit>
                                    </ButtonForm>
                                }
                                
                            </ButtonContainer>
                        </BigContainer>
                    </>
                        
                )
            }
    }

    return (
        <>
        { LandingbyProgress() }
        </>
    )
}

export default Write

const BigContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    opacity: ${r => r.SpinnerFlag ? "0.2":"1"};
`
const MiddleContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
`

const TitleBox = styled.input`
    margin-bottom: 50px;
    width: 60vw;
    height: 30px;
    border: none;
    border-bottom: 3px solid lightgrey;
    outline: none;
`
const DesBox = styled.textarea`
    border: 3px solid lightgrey;
    outline: none;
    min-height: 300px;
    min-width:  60vw;
    resize: none;
    
`
const ButtonSubmit = styled.button`
    width: 70px;
    height: 30px;
    font-size: 15px;
    border: none;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    :hover{
        background-color: black;
        color: white;
        cursor: pointer;
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
        font-weight: bold;
    }
`
const ButtonForm = styled.div`
    display: flex;
    width: 20vw;
    flex-direction: row;
    justify-content: space-around;

`

const InputImage = styled.label`
    padding: 6px 25px;
    background-color:#FF6600;
    border-radius: 4px;
    color: white;
    cursor: pointer;
`

const DropZoneForm = styled.div`
    margin-top: 20px;
    height: 70px;

`