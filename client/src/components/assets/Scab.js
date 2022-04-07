import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from "styled-components";

function WalletConnectForm(props) {
    const [ScabFlag, setScabFlag] = useState(false); // false = 앞면 , true = 뒷면;
    const _scab = useRef();

    // 카드 플립 애니메이션 구현
    useEffect(() => {
        _scab.current.addEventListener("mouseenter", (e) => {
            setScabFlag(true);
        })

        _scab.current.addEventListener("mouseleave", (e) => {
            setScabFlag(false);
        })
    }, []);

    return (
        <>
            <ScabComponent ref={_scab} flag={ScabFlag} onClick={props.handleClick}>
                <Img flag={ScabFlag} src={props.img} alt="stackImg" />
                <Text flag={ScabFlag}>{props.name}</Text>
            </ScabComponent>
            
        </>
    )
}

export default WalletConnectForm;

const hoverAnimation__Img__up = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0.2;
    }
`;

const hoverAnimation__Img__down = keyframes`
    from {
        opacity: 0.2;
    }
    to {
        opacity: 1;
    }
`;

const hoverAnimation__Text__up = keyframes`
    from {
        left: -100px;
        opacity: 0;
    }
    to {
        left: -25px;
        opacity: 1;
    }
`;

const hoverAnimation__Text__down = keyframes`
    from {
        left: -25px;
        opacity: 1;
    }
    to {
        left: -100px;
        opacity: 0;
    }
`;

const handleBackground__up = keyframes`
    from {
        background-color: white;
    }
    to {
        background-color: rgba(0, 0, 0, 0.5);
    }
`;

const handleBackground__down = keyframes`
    from {
        background-color: rgba(0, 0, 0, 0.5);
    }
    to {
        background-color: white;
    }
`;

const ScabComponent = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 80px;
    animation-name: ${r => r.flag ? handleBackground__up:handleBackground__down};
    animation-duration: .5s;
    animation-fill-mode: both;
    :hover {
        cursor: pointer;
    }
`;

const Img = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    z-index: 1;
    animation-name: ${r => r.flag ? hoverAnimation__Img__up:hoverAnimation__Img__down};
    animation-duration: .5s;
    animation-fill-mode: both;
`;

const Text = styled.div`
    opacity: 0;
    position: absolute;
    width: 150px;
    text-align: center;
    color: white;
    font-size: 10px;
    font-weight: 800;
    z-index: 2;
    top: 45px;
    user-select: none;
    animation-name: ${r => r.flag ? hoverAnimation__Text__up:hoverAnimation__Text__down};
    animation-duration: .5s;
    animation-fill-mode: both;
`;
