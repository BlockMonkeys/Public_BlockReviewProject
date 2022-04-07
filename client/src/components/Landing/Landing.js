import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import Store from './sections/Store';
import axios from "axios";

function Landing(props) {
    const [StoreList, setStoreList] = useState([]);

    useEffect( async() => {
        const result = await axios.get('https://server.monstercoders.io/api/blockreview/store/get' , { withCredentials : true })
        setStoreList(result.data.payload);
    }, [props.user])

    return (
        <>
        <div style={{ textAlign: "center", fontSize: "20px", lineHeight: "30px"}}>
            <h1>BlockReview Dapp(0.1 TestVersion) 사용안내</h1>
            <div>1. 크롬앱에서 사용 부탁드리며, 메타마스크를 다운로드해주세요. <DownloadLink onClick={()=> window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ko", "_blank")}>다운로드하기</DownloadLink></div>
            <div style={{ fontSize: "20px" }}>2. 네트워크 설정을 Rinkeby로 변경해주세요.</div>
            <div>3. 회원가입을 진행하시고, 상단의 MyPage탭에서 Faucet 버튼을 통해 10000 BRC 토큰을 지급받고 글쓰기 및 기타 기능을 사용하실 수 있습니다.</div>
            <div>※ GSN 적용이 완료되었으므로, 이더리움 없이 사용하실 수 있습니다. (글쓰기요금 = 1000 BRC, 좋아요 요금 = 100 BRC Token은 소모됩니다.) 🙂</div>
            <div>※ 혹시 에러가 발생하거나, 진행 시간이 1분이상 지속된다면 테스트 네트워크의 일시적 오류입니다.(Rinkeby Testnet Err) 잠시후 다시 시도 부탁드립니다.😅</div>
            <div>
                <h3>기능소개</h3>
                <div>아래에 원하시는 상점 목록에 들어가, 리뷰를 작성해보세요. 리뷰는 NFT화되며 MyPage에서 자신의 리뷰 목록의 제목을 클릭해 NFT 조회가 가능합니다. 👍</div>
                <div>다른 리뷰가 도움이 되었다면 좋아요를 해주세요 ! 이후 받은 좋아요의 일정 부분의 수익을 참여자분도 받을 수 있습니다.</div>
                <div>MyPage에서 보유한 또는 작성한 리뷰를 판매해보세요 !</div>
            </div>
        </div>

        <h1 style={{ textAlign: "center" }}>상점목록</h1>
            <BigContainer>
                {
                    StoreList && StoreList.map((item, idx) => (
                        <div style={{ padding: "30px" }} key={idx}>
                            <Store Img={item.img} name={item.name} Des={item.Des} Id={item.id}/>
                        </div>
                ))}
            </BigContainer>
        </>
    )
}

export default Landing


const BigContainer = styled.div`
    width: 99vw;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
`

const DownloadLink = styled.div`
    display: inline;
    color: blue;
    :hover{
        opacity: 0.6;
        cursor: pointer;
    }
`;
