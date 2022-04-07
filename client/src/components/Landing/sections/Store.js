import React from 'react'
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";

function Store(props) {
    const navi = useNavigate();
    const MoveTo = () => {
        navi(`/store/${props.Id}`)
    }
    return (
        <>
            {props &&
                    <>
                        <StoreForm>
                            <ImgForm><Img src={props.Img} alt="Store Image" onClick={MoveTo}/></ImgForm>
                            <Title>{props.name}</Title>
                        </StoreForm>
                    </>
            }
        </>
    )
}

export default Store;

const ImgForm = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
`;

const Title = styled.div`
    margin-top: 15px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
`;

const StoreForm = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 250px;
    border: .5px solid lightgray;
    padding: 15px;
    margin: 10px 0px;
       :hover{
       opacity: 0.5;
       cursor: pointer;
       font-weight: bold;
    }
`;