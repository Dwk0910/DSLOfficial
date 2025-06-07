import * as React from 'react';
import { getURLString, getUserInfo, LocalStorage } from "../Util";

import Topmenu from '../component/Topmenu';

import img_title from '../docs/title.png';
import banner_1 from '../docs/banners/banner_1.png';

// page import
import Error404 from '../pages/Error404';
import Main from '../pages/Main';
import Notification from '../pages/Notification';
import DDM from '../pages/DDM.js';

import { Lock, ShieldOff } from 'lucide-react';
import { useEffect, useState } from "react";

function App() {
    if (window.location.search.includes("pid=0")) window.location.assign('.');

    // 미리 등록된 LocalStorage에 대해 Validation
    const ls = LocalStorage();
    const [userInf, setUserInf] = useState();

    useEffect(() => {
        getUserInfo().then((e) => { setUserInf(e); });
    }, []);

    if (userInf) {
        if (userInf["id"] === "userstatus_unlogined") {
            // 잘못된 값이 있는 것이므로 제거
            ls.remove("id");
            ls.remove("pwd");
        }
    } else return;

    const bannerMap = {
        img: banner_1,
        link: '.?pid=1&t=1'
    };

    let banner = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
            <img src={bannerMap.img} alt={"banner"} width={"90.9%"} onClick={() => window.location.assign(bannerMap.link)} style={{ cursor: 'pointer' }}/>
        </div>
    );

    let page;
    switch (getURLString('pid')) {
        case '0': page = <Main/>; break;
        case '1': page = <Notification/>; break;
        case '5': page = <DDM/>; break;
        case 'S': {
            page = (<span>리디렉션 중...</span>);
            window.location.assign("https://dslwiki.kro.kr");
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
        case 'er404': page = <Error404/>; break;
        default: page = <Error404/>; break;
    }
  return (
      <div style={{ width: '1000px', backgroundColor: 'white' }}>
          <div style={{ position: 'fixed', backgroundColor: 'white', width: '1000px', zIndex: '1' }}>
              <img src={img_title} alt="" style={{ width: "500px", marginLeft: '50px', cursor: 'pointer' }} onClick={() => {
                  window.location.assign('.');
              }}/>
              <span style={{ borderTop: '1px solid gray', display: 'flex', width: '100%' }}></span>
          </div>
          <div style={{ paddingTop: '80px' }}></div>
          {banner}
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