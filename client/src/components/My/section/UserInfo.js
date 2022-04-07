import React from 'react';
import styled from 'styled-components';
import axios from "axios";
import { useAlert } from "react-alert";

function UserInfo(props) {
    const alert = useAlert();
    const logout = async() => {
        const result = await axios.post("https://server.monstercoders.io/api/blockreview/user/logout", {}, {withCredentials: true})
        if(result.data.success){
            window.location.href = "/";
        } else {
            alert.error("일시적인 오류로 실패했습니다");
        }
    }

    return (
        <>
        <h1>내 정보</h1>
            <UserForm>
                <UserInfoBox>
                    <UserInfo_Label>Address : </UserInfo_Label>
                    <UserInfo_Content>{props.account}</UserInfo_Content>
                </UserInfoBox>
                <UserInfoBox>
                    <UserInfo_Label>Email : </UserInfo_Label>
                    <UserInfo_Content>{props.user.email}</UserInfo_Content>
                </UserInfoBox>
                <UserInfoBox>
                    <UserInfo_Label>NickName : </UserInfo_Label>
                    <UserInfo_Content>{props.user.nickname}</UserInfo_Content>
                </UserInfoBox>
                <UserInfoBox>
                    <UserInfo_Label>Phone : </UserInfo_Label>
                    <UserInfo_Content>{props.user.phone}</UserInfo_Content>
                </UserInfoBox>
                <UserInfoBox>
                    <UserInfo_Label>{props.tokenName} : </UserInfo_Label>
                    <UserInfo_Content>{props.tokenBalance}</UserInfo_Content>
                </UserInfoBox>
                <UserInfoBox>
                    <UserInfo_Label>ETH : </UserInfo_Label>
                    <UserInfo_Content>{props.ethBalance}</UserInfo_Content>
                </UserInfoBox>
                
                <div style={{ textAlign: "center" }}>
                    <Button onClick={logout}>LOGOUT</Button>
                </div>
            </UserForm>
        </>
    )
}

export default UserInfo


const UserForm = styled.div`
    display: flex;
    flex-direction:  column;
    justify-content: space-around;
    width: 80%;
    height: 60vh;
    border: 1px solid lightgray;
    overflow: hidden;
    padding: 20px;
`;

const UserInfoBox = styled.div`
    display: flex;
    font-size: 20px;
`;

const UserInfo_Label = styled.label`
    font-weight: 600;
    width: 250px;
    text-align: left;
`;

const UserInfo_Content = styled.div`
    width: 100%;
    text-overflow: ellipsis;
`;


const Button = styled.button`
    align-items: center;
    padding: 13px 0 13px;
    width: 80%;
    color: white;
    background-color: black;
    border-radius: 10px;
    :hover {
        cursor: pointer;
        color: red;
    }

`
