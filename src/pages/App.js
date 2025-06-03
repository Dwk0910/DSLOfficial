import * as React from 'react';
import $ from 'jquery';
import { getURLString, LocalStorage } from "../Util";

import Topmenu from '../component/Topmenu';

import img_title from '../docs/title.png';
import banner_1 from '../docs/banners/banner_1.png';

// page import
import Error404 from '../pages/Error404';
import Main from '../pages/Main';
import Notification from '../pages/Notification';

function App() {
    if (window.location.search.includes("pid=0")) window.location.assign('.');

    // 미리 등록된 LocalStorage에 대해 Validation
    const ls = LocalStorage();
    if (ls.get("id") !== null && ls.get("pwd") !== null) {
        $.ajax({
            type: "POST",
            url: "https://neatorebackend.kro.kr/dslofficial/login",
            contentType: "application/json; charset=utf-8",
            data: `{"id":"${ls.get("id")}", "pwd":"${ls.get("pwd")}"}`
        }).then((e) => {
            if (JSON.parse(e).status !== "true") {
                // ls에 등록된 id/pwd가 잘못됨 <- 악용 방지 및 비밀번호 변경 시 자동로그인 해제
                ls.remove("id");
                ls.remove("pwd");
            }
        });
    } else {
        // 둘 중에 하나가 없는 것이므로 둘다 제거
        ls.remove("id");
        ls.remove("pwd");
    }

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
        case 'S': window.location.assign('https://dslwiki.kro.kr'); break;
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