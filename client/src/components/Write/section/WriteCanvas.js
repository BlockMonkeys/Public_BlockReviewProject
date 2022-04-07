import React from 'react';
import styled from 'styled-components';

function WriteCanvas(props) {
    return ( 
            <BigContainerDetail>
                <DetailContainer >
                    <TitleContainer>
                        <TitleStyle>
                        {props.title}
                        </TitleStyle>
                        <TitleContent>
                        작성자 : {props.account}    
                        </TitleContent>
                    </TitleContainer>
                    <DescriptionContainer>
                        <BoardDetail>
                            {props.des}
                        </BoardDetail>
                    </DescriptionContainer>
                </DetailContainer>
            </BigContainerDetail>
    )
}

export default WriteCanvas



const DetailContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid lightgrey;
    min-width: 1000px;
    min-height: 50vh;
    background-color: white;
`

const BigContainerDetail = styled.div`
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