import React from "react";
import {Routes, Route} from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Header from "./components/Header/Header";
import Write from "./components/Write/Write";
import Detail from "./components/Detail/Detail";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Auth from "./components/Hoc/Auth";
import My from "./components/My/My";
import RegisterStore from "./components/RegisterStore/RegisterStore";
import DetailStore from "./components/StoreDetail/StoreDetail";

function App () {
  // HOC
  const LandingPage = Auth(Landing, null);
  const WritePage = Auth(Write, true);
  const DetailPage = Auth(Detail, true);
  const LoginPage = Auth(Login, false);
  const RegisterPage = Auth(Register, false);
  const MyPage = Auth(My, true);
  const RegisterStorePage = Auth(RegisterStore, null);
  const DetailStorePage = Auth(DetailStore, null);

  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/review/create/:category" element={<WritePage />}/>
          <Route path="/store/:category/:id" element={<DetailPage />}/>
          <Route path="/user/login" element={<LoginPage />}/>
          <Route path="/user/register" element={<RegisterPage />}/>
          <Route path="/user/mypage/:id" element={<MyPage/>}/>
          <Route path="/store/register" element={<RegisterStorePage />}/>
          <Route path="/store/:storeId" element={<DetailStorePage />}/>
        </Routes>
    </>
  );
}
           
export default App;
