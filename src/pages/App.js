import * as React from 'react';

import Topmenu from '../component/Topmenu';
import img_title from '../docs/title.png';

function App() {
    if (window.location.search.includes("pid=0")) {
        window.location.assign('.');
    }
  return (
      <div style={{ paddingTop: '20px', width: '1000px', backgroundColor: 'white' }}>
          <Topmenu/>
          <img src={img_title} alt="" style={{ width: "500px" }} />
      </div>
  );
}

export default App;