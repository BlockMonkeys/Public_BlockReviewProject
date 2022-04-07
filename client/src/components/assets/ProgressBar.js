import React from 'react'
import styled from "styled-components";

function ProgressBar(props) {
    return (
        <>
        <Text>{props.percent <= 50 ? "Stage 1": "Stage 2"}</Text>
        <OuterBox>
            <InnerBox percent={props.percent}>
            </InnerBox>
        </OuterBox>
        </>
        
    )
}

export default ProgressBar

const OuterBox = styled.div`
    width: 100%;
    height: 25px;
    background-color: whitesmoke;
    border : 1px solid lightgray;
    border-radius: 25px;
    overflow: hidden;
`;

const InnerBox = styled.div`
    width: ${r => `${r.percent}%`};
    height: 25px;
    background-color: yellow;
    border-radius: 25px;
`;

const Text = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
`;