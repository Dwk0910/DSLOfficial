import * as React from 'react';
import { getURLString } from "../Util";

import Topmenu from '../component/Topmenu';

import img_title from '../docs/title.png';
import banner_1 from '../docs/banners/banner_1.png';

// page import
import Main from '../pages/Main';
import Notification from '../pages/Notification';

function App() {
    // Pre-set
    document.title = "DSL OFFICIAL"

    if (window.location.search.includes("pid=0")) {
        window.location.assign('.');
    }

    const bannerMap = {
        img: banner_1,
        link: '.?pid=1&read=1'
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
        default: page = <h1>Error 404</h1>; break;
    }
  return (
      <div style={{ width: '1000px', backgroundColor: 'white' }}>
          <img src={img_title} alt="" style={{ width: "500px", marginLeft: '50px', cursor: 'pointer' }} onClick={() => {
              window.location.assign('.');
          }}/>
          <span style={{ borderTop: '1px solid gray', marginBottom: '20px', display: 'flex', width: '100%' }}></span>
          {banner}
          <Topmenu/>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {page}
          </div>
      </div>
  );
}

export default App;