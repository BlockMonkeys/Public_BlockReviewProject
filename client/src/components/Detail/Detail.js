import React, {useState, useEffect} from 'react';
import { contract_review } from "../../config-web3";
import { useParams } from "react-router";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios"
import Spinner from "../assets/Spinner";
import FunctionalBox from "./sections/FunctionBox";
import { useAlert } from 'react-alert';

function Detail(props) {
    const navi = useNavigate();
    const { id } = useParams();
    const [Review, setReview] = useState({});
    const alert = useAlert();

    useEffect(() => {
        axios.post(`https://server.monstercoders.io/api/blockreview/review/read/${id}` , {} , {withCredentials : true} )
            .then(res => {
            if(res.status === 200){
                setReview(res.data.payload);
            } else {
                alert.error("글 정보 조회에 실패했습니다.");
            }
        })
    }, [contract_review])

    return (
        <> 
        {Review ?
        <BigContainer>
            <DetailContainer>

                {/* Header */}
                <TitleContainer>

                    <TitleStyle>
                    {Review.title}
                    <BackButton onClick={() => navi(-1 ,{replace : true})}>목록</BackButton>
                    </TitleStyle>

                    <TitleContent>
                        작성자 : {Review.writer}    
                    </TitleContent>

                </TitleContainer>

                {/* Description */}
                <DescriptionContainer>
                    <BoardDetail>
                        {Review.description}
                    </BoardDetail>
                </DescriptionContainer>

                {/* Functional Box */}
                <FunctionalBox 
                    id={id} 
                    account={props.account} 
                    user={props.user} 
                    review={Review} 
                />
            </DetailContainer>
        </BigContainer>
        :
        <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner />
        </div>
        }
        
        </>
    )
}

export default Detail

const DetailContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid lightgrey;
    min-width: 1000px;
    min-height: 50vh;
    background-color: white;
`

const BigContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
`
const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 700px;
    border-bottom: 1px solid lightgray;
`
const TitleStyle = styled.div`
    font-size: 40px;
`
const TitleContent = styled.span`
    display: flex;
    justify-content: left;
    color: gray;
    margin-bottom: 10px;
` 
const DescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 700px;
    border-bottom: 1px solid lightgray;
    margin-bottom: 20px;
` 
const BoardDetail = styled.div`
    margin-bottom: 20px;

`
const BackButton = styled.div`
    float: right;
    font-size: 15px;
    border: solid 1px lightgrey;
    padding: 5px 5px;
    font-weight: bold;
    :hover{
        cursor: pointer;
    }
`
