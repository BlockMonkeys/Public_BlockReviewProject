import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import uuid from "react-uuid";
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";

function RegisterStore(props) {
    const [StoreName, setStoreName] = useState("");
    const [Uuid, setUuid] = useState("");
    const [StoreDescription, setStoreDescription] = useState("");
    const [StoreImgUrl, setStoreImgUrl] = useState("");
    const [OwnerId, setOwnerId] = useState(1);

    const navi = useNavigate();
    const alert = useAlert();

    useEffect(() => {
        setUuid(uuid());
        if(props.user.auth){
            if(props.user.role === 0){
                setOwnerId(props.user.id);
            } else {
                navi('/');
                alert.error("점주유저가 아닙니다!")
            }
        }
   
    }, [props.user]);

    // Img Upload to S3
    const handleImg = async (e) => {
      const img = e.target.files[0];
      if(img){
        const s3 = new AWS.S3({
            accessKeyId: process.env.REACT_APP_AWS_ACCESSKEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRETKEY,
            region: process.env.REACT_APP_AWS_REGION,
        });

        const uploadParams = {
            ACL: "public-read",
            Body: img,
            Key: "blockreview/" + Uuid,
            Bucket: "blockmonkey-assets",
            ContentType: img.type,
        };

        s3.putObject(uploadParams, (err, result)=> {
            if(err) throw err;
            setStoreImgUrl(`https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/${Uuid}`);
        });
      }
    }
    

    //Register Store
    const submit = async() => {
        const payload = {
            id : Uuid,
            name : StoreName,
            description: StoreDescription,
            owner: OwnerId,
            img : StoreImgUrl
        }
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/store/register", payload, {withCredentials : true});
        if(result.data.success) {
            navi("/");
        }
    }

    const cancel = async() => {
        navi(-1);
    }

    return (
        <>
        {/* UUID , NAME, DESCRIPTION, OWNER, IMG */}
            <Container>
                <h1 style={{"marginBottom" : "50px"}}>가게등록</h1>
                <MiddleContainer>
                    <TitleBox type="text" placeholder='가게이름' value={StoreName} onChange={e => setStoreName(e.currentTarget.value)} />
                    <DesBox placeholder='가게설명' value={StoreDescription} onChange={e => setStoreDescription(e.currentTarget.value)}/>
                    <UploadBox>
                        <Label>대표이미지 설정 :</Label>
                        <input type="file" onChange={handleImg} />
                        {StoreImgUrl &&
                            StoreImgUrl ?
                                <ImgBox>
                                    <Img src={StoreImgUrl} />
                                </ImgBox>
                                :
                                <div>
                                </div>
                        }
                    </UploadBox>
                </MiddleContainer>

                <Functional>
                    <Btn onClick={cancel}>취소</Btn>
                    <Btn onClick={submit}>등록</Btn>
                </Functional>
            </Container>
        </>
    )
}

export default RegisterStore;

const Container = styled.div`
    width: 100%;
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
`;

const TitleBox = styled.input`
    margin-bottom: 10px;
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

const Functional = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const Btn = styled.button`
    width: 150px;
    height: 30px;
    font-size: 15px;
    border: none;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    margin: 15px;
    :hover{
        background-color: black;
        color: white;
        cursor: pointer;
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
        font-weight: bold;
    }
`;

const UploadBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 15px 0px;
`;

const Label = styled.label`
    font-weight: 600;
    margin-right: 15px;
`;

const ImgBox = styled.div`
    width: 40px;
    height: 40px;
    object-fit: cover;
    overflow: hidden;
`;

const Img = styled.img`
    width: 100%;
`;