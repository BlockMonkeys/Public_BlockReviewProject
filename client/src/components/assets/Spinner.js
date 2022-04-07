import React from 'react'
import styled, { keyframes } from "styled-components";

function Spinner(props) {
    return (
        <ComponentBox>
            <div style={{ width: "90%", height: "90%" }}>
                <Img src="https://blockmonkey-assets.s3.ap-northeast-2.amazonaws.com/blockreview/logo.png" />
            </div>
 
            <div style={{ fontWeight: "700", zIndex: 5, textAlign: "center"}}>Loading............ 🙂</div>
        </ComponentBox>
    )
}

export default Spinner;


const Spin = keyframes`
    to {
        -webkit-transform: rotateY(360deg);
    }
`;

const ComponentBox = styled.div`
    width: 250px;
    height: 250px;
    overflow: hidden;
    contain: cover;
    user-select: none;
    animation-name: ${Spin};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
`;
