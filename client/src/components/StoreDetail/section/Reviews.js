import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from "../../assets/Spinner";

function Reviews(props) {
    const navi = useNavigate();
    const category = props.storeId;
    const [AllReviews, setAllReviews] = useState(null);
    const [Spinner_Flag, setSpinner_Flag] = useState(false);

    useEffect(async() => {
        setSpinner_Flag(true);
        let payload = {
            category : category
        }
        const verifedResult = await axios.post("https://server.monstercoders.io/api/blockreview/review/verification", payload, {withCredentials : true});
        if(verifedResult.data.success) {
            setAllReviews(verifedResult.data.payload);
            setSpinner_Flag(false);
        } else {
            setSpinner_Flag(false);
        }
    }, [props.user]);


    const Routing = (e) => {
        const flag = e.currentTarget.getAttribute("value");
        if(flag === "false"){
           return;
        }

        const review_id = e.currentTarget.id;
        navi(`${review_id}`);
    }

    return (
        <ReviewForm>
            <Table>
                { Spinner_Flag ? 
                    <div style={{ width: "80vw", height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Spinner />
                    </div>
                            :
                    <>
                {/* Head */}
                <Thead>
                    <Thead_div>ID</Thead_div>
                    <Thead_div>Title</Thead_div>
                    <Thead_div>Liked</Thead_div>
                    <Thead_div>Price</Thead_div>
                </Thead>
                {AllReviews ?
                    AllReviews.map((item, idx)=> (
                        <Tbody value={item.verified}  key={idx} id={item.id} onClick={Routing}>
                            { item.verified ?
                            <>
                                <Tbody_div>{item.id}</Tbody_div>
                                <Tbody_div>{item.title}</Tbody_div>
                                <Tbody_div>{item.liked.length}</Tbody_div>
                                <Tbody_div>{Number(item.price) ? item.price : "미판매"}</Tbody_div>
                            </>
                            :
                                <Tbody_none >❌ 미검증 글 입니다. ❌</Tbody_none>
                            }   
                        </Tbody>
                    ))
                :   
                    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div>작성된 리뷰가 없습니다.</div>
                    </div>
                }
                </>
                }
            </Table>
        </ReviewForm>
    )
}

export default Reviews;


const ReviewForm = styled.div`
    width: 100%;
    margin-bottom: 50px;
`

const Table = styled.div`
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
    border: 1px solid lightgrey;
`;

const Thead = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80px;
    font-weight: 600;
    border-bottom: 1px solid gray;
`;

const Thead_div = styled.div`
    text-align: center;
    :nth-child(1){
        width: 5%;
    }
    :nth-child(2){
        width: 20%;
    }
    :nth-child(3){
        width: 10%;
    }
    :nth-child(4){
        width: 20%;
    }
    :nth-child(5){
        width: 20%;
    }
    :nth-child(6){
        width: 12.5%;
    }
    :nth-child(7){
        width: 12.5%;
    }
`;

const Tbody = styled.div`
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    :hover {
        cursor: pointer;
        background-color: lightgray;
    }
    background-color: ${r => r.value ? "white" : "lightgray"};
`;

const Tbody_div = styled.div`
    text-align: center;
    :nth-child(1){
        width: 5%;
    }
    :nth-child(2){
        width: 20%;
    }
    :nth-child(3){
        width: 10%;
    }
    :nth-child(4){
        width: 20%;
    }
    :nth-child(5){
        width: 20%;
    }
    :nth-child(6){
        width: 12.5%;
    }
    :nth-child(7){
        width: 12.5%;
    }
`;

const Tbody_none = styled.div`
    width: 100%;
    text-align: center;
 

`


