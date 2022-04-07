import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { contract_review } from '../../../config-web3';

function EventBar() {

    const [ReviewEvents, setReviewEvents] = useState({});
    const [LikeEvents, setLikeEvents] = useState({});
    const [WriteFlag, setWriteFlag] = useState(false);
    const [LikeFlag, setLikeFlag] = useState(false);
    const [NftEvents, setNftEvents] = useState({});
    const [TradeFlag, setTradeFlag] = useState(false);

    const handleEvent = async() => {
       await contract_review.once ("review_event", {
            fromBlock: "latest"
        }, (err, event) => {
            if(event){
                setReviewEvents(event.returnValues);
                setWriteFlag(true);
            } else {
                throw err;
            }
        });

        await contract_review.once("like_event", {
            fromBlock: "latest"
        }, (err, event) => {
            if(event){
                setLikeEvents(event.returnValues);
                setLikeFlag(true);
            } else{
                throw err;
            }
        });

        await contract_review.once("tradeNft_event", {
            fromBlock: "latest"
        }, (err, event) => {
            if(event){
                setNftEvents(event.returnValues);
                setTradeFlag(true);
            } else {
                throw err;
            }
        });
    }

    useEffect(() => {
        handleEvent();
        setTimeout(() => {
            setWriteFlag(false);
            setLikeFlag(false);
            setTradeFlag(false);
        }, 3000);
    }, [ReviewEvents, LikeEvents, NftEvents]);


    return (
        <EventContainer>
            {WriteFlag &&
                <>
                    {ReviewEvents.writer} 님이 글을 작성하셨습니다. id : {ReviewEvents.nftId}
                </>
            }

            {LikeFlag &&
                <>
                    {LikeEvents.writer} 님이 {LikeEvents.title} 글에 좋아요를 누르셨습니다.
                </>
            }

            {TradeFlag &&
                <>
                    {NftEvents._to} 님이 {LikeEvents._from} 님의 {NftEvents._tokenId} 글을 구매했습니다.
                </>
            }
        </EventContainer>
    )
}

export default EventBar

const EventContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    background-color: black;
    color: white;
`
