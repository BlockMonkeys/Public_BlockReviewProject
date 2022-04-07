import React, { useState, useEffect } from 'react'
import Axios from "axios";

export default function(SpecificComponent, option){
    
    function AuthCheck(props){
        const [Account, setAccount] = useState("");
        const [UserInfo, setUserInfo] = useState([]);


        useEffect(() => {
            Axios.post("https://server.monstercoders.io/api/blockreview/user/auth", {}, {withCredentials: true})
                .then(async(res) => {
                    // 로그인 사용자 정보 State에 추가하기
                    if(res.data.auth && UserInfo.length === 0){
                        let temp = {
                            id : res.data.id,
                            email : res.data.email,
                            nickname : res.data.nickname,
                            accountPubKey : res.data.accountPubKey,
                            phone: res.data.phone,
                            jwtToken : res.data.jwtToken,
                            registeredAt: res.data.registeredAt,
                            role: res.data.role,
                            walletType: res.data.walletType,
                            auth: res.data.auth
                        };
                        setUserInfo(temp);
                        setAccount(res.data.accountPubKey)
                    }
                });
        }, []);


        return (
          
                <SpecificComponent user={UserInfo} account={Account}/>
           
        )
    

    }
    
    return AuthCheck;

}



    

