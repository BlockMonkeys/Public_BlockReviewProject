import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Reviews from "./section/Reviews";
import axios from "axios";
import { useParams , useNavigate} from "react-router-dom";

function StoreDetail(props) {
    const [StoreInfo, setStoreInfo] = useState({});
    const navi = useNavigate();
    const { storeId } = useParams();

    //StoreID EX : 145c820-ee-15c2-ddbf-ec78b785ca7
    useEffect(async() => {
        const storeResult = await axios.get(`https://server.monstercoders.io/api/blockreview/store/get/${storeId}`, {withCredentials : true});
        if(storeResult.data.success){
            storeResult.data.payload[0].registeredAt = storeResult.data.payload[0].registeredAt.split("T")[0];
            setStoreInfo(storeResult.data.payload[0]);
        }
    }, [props.user])

    const MoveToCreate = () => {
        navi(`/review/create/${storeId}`)
    }
    
    return (
        <Container>
            {/* Store Detail */}
                {StoreInfo && 
                    <>
                    <h1>상점상세정보</h1>
                    <StoreContainer>
                        <ImgBox>
                            <Img_store src={StoreInfo.img} alt="Store Image"/>
                        </ImgBox>

                        <Store_Info_container>

                            <Store_Info_box>
                                <Store_Info_label>ID : </Store_Info_label>
                                <Store_Info_content> {StoreInfo.id}</Store_Info_content>
                            </Store_Info_box>

                            <Store_Info_box>
                                <Store_Info_label>이름 : </Store_Info_label>
                                <Store_Info_content> {StoreInfo.name}</Store_Info_content>
                            </Store_Info_box>

                            <Store_Info_box>
                                <Store_Info_label>등록날짜 :</Store_Info_label>
                                <Store_Info_content> {StoreInfo.registeredAt}</Store_Info_content>
                            </Store_Info_box>

                            <Store_Info_box>
                                <Store_Info_label>Store Description :</Store_Info_label>
                                <Store_Info_Description>{StoreInfo.description}</Store_Info_Description>
                            </Store_Info_box>

                        </Store_Info_container>
                    </StoreContainer>

                    {/* Review Detail(Get Review By Category) */}
                        <div style={{ width: "80%", margin: "10px"}}>
                        <h1 style={{ textAlign: "center" }}>리뷰정보</h1>
                        <ButtonForm><CreateButton onClick={MoveToCreate}>글쓰기</CreateButton></ButtonForm>
                            <Reviews storeId={storeId} />
                        </div>
                    </>
                }
        </Container>
    )
}

export default StoreDetail;


const Container = styled.div`
    margin: 10px;
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const StoreContainer = styled.div`
    width: 600px;
    border: 1px solid gray;
    overflow: hidden;
`;

const ImgBox = styled.div`
    width: 100%;
    height: 300px;
    overflow: hidden;
`;

const Img_store = styled.img`
    width: 100%;
    height: 100%;
    object-fit: fill;
`;

const Store_Info_container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 18px;
`;

const Store_Info_box = styled.div`
    display: flex;
    margin: 20px;
`;

const Store_Info_label = styled.label`
    width: 140px;
    font-weight: 600;
`;

const Store_Info_content = styled.div`
    width: 400px;
`;

const Store_Info_Description = styled.div`
    width: 400px;
    max-height: 4.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
`;
const CreateButton = styled.div`
    border : 1px solid black;
    border-radius: 15px;
    color: black;
    width: 60px;
    padding: 5px;
    text-align: center;
    right: 0;
    :hover{
        background-color: black;
        color: white;
        cursor: pointer;
        font-weight: bold;
    }
`
const ButtonForm = styled.div`
    display : flex;
    justify-content : flex-end;
    margin-bottom : 10px;
    margin-right : 10px;
    margin-top : 10px;
`