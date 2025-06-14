import * as React from 'react';
import { useEffect, useState, useMemo, useRef } from "react";

import { Lock, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getPermission, getURLString, getUserInfo, LocalStorage } from "../Util";

import Topmenu from '../component/Topmenu';

import img_title from '../docs/title.png';

// page import
import Main from '../pages/Main';
import Notification from '../pages/Notification';
import Forum from '../pages/Forum';
import ReqCentre from '../pages/ReqCentre';
import Library from '../pages/Library';
import DDM from '../pages/DDM.js';

import banner_1 from '../docs/banners/banner_1.png';
import banner_2 from '../docs/banners/banner_2.png';
import banner_3 from '../docs/banners/banner_3.png';

import error404 from "../docs/error404.gif";
import Management from "./Management";

function App() {
    if (window.location.search.includes("pid=0")) window.location.assign('.');

    // 미리 등록된 LocalStorage에 대해 Validation
    const ls = LocalStorage();
    const [userInf, setUserInf] = useState();

    // 배너 정보, 자동 배너 변경을 위한 useState
    const bannerSourceList = useMemo(() => [
        banner_1,
        banner_2,
        banner_3
    ], []);

    useEffect(() => {
        bannerSourceList.forEach(src => {
            const img = new Image();
            img.onload = () => {};
            img.src = src;
        });
    }, [bannerSourceList]);

    const bannerLinkList = [
        ".?pid=1&t=1",
        "https://discord.gg/wBu7McQZcS",
        "http://dsl-seojeon.kro.kr/"
    ];

    const [currentBanner, setCurrentBanner] = useState(0);

    const intervalId = useRef(null);
    useEffect(() => {
        if (intervalId.current) clearInterval(intervalId.current);
        intervalId.current = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % bannerSourceList.length);
        }, 8000); // 8초마다 변경

        return () => clearInterval(intervalId.current); // 컴포넌트 언마운트 시 인터벌 정리
    }, [bannerSourceList.length]);

    // get userinfo (Promise) - 이 아래로는 useXXX() 사용불가
    useEffect(() => {
        getUserInfo().then((e) => { setUserInf(e); });
    }, []);

    // edit_name과 name_content는 ?et가 없을 땐 지워저야 함.
    if (getURLString("et") === "0" && (ls.get("edit_title") !== null || ls.get("edit_content") !== null)) {
        ls.remove("edit_title");
        ls.remove("edit_content");
    }

    if (userInf) {
        if (userInf["id"] === "userstatus_unlogined") {
            // 잘못된 값이 있는 것이므로 제거
            ls.remove("id");
            ls.remove("pwd");
        }
    } else return;

    // TODO: 알림시스템 만들기

    let page;
    switch (getURLString('pid')) {
        case '0': page = <Main/>; break;
        case '1': page = <Notification/>; break;
        case '2': page = <Forum/>; break;
        case '3': page = <ReqCentre/>; break;
        case '4': page = <Library/>; break;
        case '5': page = <DDM/>; break;
        case '6': {
            alert("DCS 2시즌 1분기에 개발 시작 예정");
            window.location.assign(".");
            break;
        }
        case 'S': {
            page = (<span>리디렉션 중...</span>);
            window.location.assign("https://dslwiki.kro.kr");
            break;
        }
        case 'M': {
            if (getPermission(userInf).includes("관리자")) page = <Management/>;
            else window.location.assign(".?pid=er404");
            break;
        }

        case 'er401': {
            page = (
                <div style={{
                    height: '500px',
                    width: '100%',
                    backgroundColor: '#fffdfc',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '15%',
                    alignItems: 'center',
                    fontFamily: 'suite',
                    color: '#333',
                    textAlign: 'center',
                    padding: '0 20px',
                }}>
                    <Lock size={64} color="#ff4d4f" strokeWidth={1.5} style={{ marginBottom: '20px' }} />
                    <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>401 Unauthorized</h1>
                    <p style={{fontSize: '1.1rem', maxWidth: '400px'}}>
                        이 페이지에 접근할 권한이 없습니다.<br/>
                        먼저 로그인하거나 권한을 확인해 주세요.
                    </p>
                    <a href="/" style={{
                        marginTop: '30px',
                        fontSize: '1rem',
                        color: '#007bff',
                        textDecoration: 'none',
                        border: '1px solid #007bff',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        transition: 'all 0.2s',
                    }}
                       onMouseOver={(e) => {
                           e.currentTarget.style.backgroundColor = '#007bff';
                           e.currentTarget.style.color = "white";
                       }}
                       onMouseOut={(e) => {
                           e.currentTarget.style.backgroundColor = 'transparent';
                           e.currentTarget.style.color = "#007bff";
                       }}>
                        홈으로 돌아가기 →
                    </a>
                </div>
            );
            break;
        }
        case 'er403': page = (
            <div style={{
                height: '500px',
                width: '100%',
                backgroundColor: '#fffdfc',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '15%',
                alignItems: 'center',
                fontFamily: 'suite',
                color: '#333',
                textAlign: 'center',
                padding: '0 20px',
            }}>
                <ShieldOff size={64} color="#ff4d4f" strokeWidth={1.5} style={{ marginBottom: '20px' }} />
                <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>403 Forbidden</h1>
                <p style={{fontSize: '1.1rem', maxWidth: '400px'}}>
                    이 페이지를 보실 권한이 없습니다.<br/>
                    정상적인 방법으로 접근해주세요.
                </p>
                <a href="/" style={{
                    marginTop: '30px',
                    fontSize: '1rem',
                    color: '#007bff',
                    textDecoration: 'none',
                    border: '1px solid #007bff',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    transition: 'all 0.2s',
                }}
                   onMouseOver={(e) => {
                       e.currentTarget.style.backgroundColor = '#007bff';
                       e.currentTarget.style.color = "white";
                   }}
                   onMouseOut={(e) => {
                       e.currentTarget.style.backgroundColor = 'transparent';
                       e.currentTarget.style.color = "#007bff";
                   }}>
                    홈으로 돌아가기 →
                </a>
            </div>
        ); break;
        case 'er404': page = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid gray', marginTop: '20px', marginBottom: '20px', width: '800px', height: '100%' }}>
                <img src={error404} alt={"error404"} width={"500px"}/>
                <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '-20px' }}>페이지를 찾을 수 없습니다.</span>
                <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                입력하신 주소의 페이지가 이동되었거나 삭제되어 찾을 수 없습니다.<br/>
                주소가 올바른지 확인하신 후 다시 시도해 주세요.
                </span>
            </div>
        ); break;
        default: window.location.assign(".?pid=er404"); break;
    }
  return (
      <div style={{ width: '1000px', backgroundColor: 'white' }}>
          <div style={{ position: 'fixed', backgroundColor: 'white', width: '1000px', zIndex: '1' }}>
              <img src={img_title} alt="" style={{ width: "500px", marginLeft: '50px', cursor: 'pointer' }} onClick={() => {
                  window.location.assign('.');
              }}/>
              <span style={{ borderTop: '1px solid gray', display: 'flex', width: '100%' }}></span>
          </div>
          {/* 배너 레이아웃 공간 확보용 더미 */}
          <div style={{ height: '10px', width: '100%' }}></div>

          {/* 배너 이미지 자체는 흐름에서 제거 (absolute로 띄움) */}
          <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1000px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: '0',
          }}>
              <AnimatePresence mode={"wait"}>
                  <motion.div
                      key={currentBanner}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{ width: '90.9%' }}
                  >
                      <img
                          src={bannerSourceList[currentBanner]}
                          alt="banner"
                          width="100%"
                          height="180px"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.open(bannerLinkList[currentBanner])}
                      />
                  </motion.div>
              </AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '90.9%', marginTop: '2px', marginRight: '15px' }}>
                  <span className={"hoverstyle"} style={{ marginRight: '20px', fontFamily: 'suite' }} onClick={() => {
                      clearInterval(intervalId.current);
                      setCurrentBanner((currentBanner <= 0) ? bannerSourceList.length - 1 : currentBanner - 1);
                  }}>{"<"}</span>
                  <span className={"hoverstyle"} style={{ fontFamily: 'suite' }} onClick={() => {
                      clearInterval(intervalId.current);
                      setCurrentBanner((currentBanner >= bannerSourceList.length - 1) ? 0 : currentBanner + 1);
                  }}>{">"}</span>
              </div>
          </div>
          <div style={{ paddingTop: '280px' }}></div>
          <Topmenu/>
          <div style={{ width: '100%', minHeight: '70vh', display: 'flex', justifyContent: 'center' }}>
              {page}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: '100%', borderTop: '1px solid gray', marginTop: '10px', paddingTop: '25px', paddingBottom: '25px', color: 'black', fontFamily: 'suite' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem', marginLeft: '25px' }}>DSLWeb</span>
              <span style={{ fontWeight: 'bold', marginLeft: '25px' }}>Designed by Dwk0910</span>
              <span style={{ marginLeft: '25px' }}>Copyright 2025. DSL All rights reserved.</span>
              <span style={{ marginLeft: '25px', marginTop: '10px', textDecoration: 'underline' }}>서버법률은 이곳에서도 똑같이 적용받습니다. 글 작성에 유의해주세요!</span>
          </div>
      </div>
  );
}

export default App;