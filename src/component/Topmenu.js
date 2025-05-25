import * as React from 'react';
import { IoHome } from 'react-icons/io5';

import './Topmenu.css';

export default function Topmenu() {
    const menuArray = [
        {
            pid: 0,
            title: "HOME",
            icon: IoHome
        },
        {
            pid: 1,
            title: "스노우 병신",
            icon: IoHome
        }
    ];

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style={{ display: 'flex', width: '90%', height: '40px', paddingLeft: '10px', backgroundColor: '#BECCF0', borderRadius: '3px', alignItems: 'center' }}>
                {
                    menuArray.map((item, idx) => {
                        let style = {
                            marginLeft: (idx === 0) ? '0' : '5px',
                            cursor: 'pointer',
                        };

                        if (idx === 0 && window.location.search === "") style.fontWeight = 'bold';
                        else if (window.location.search.includes("pid=" + idx)) style.fontWeight = 'bold';

                        const separater = (idx === menuArray.length - 1) ? "" : (
                            <span> · </span>
                        );

                        return (
                            <React.Fragment>
                                <span key={idx} className={"menu"} style={style} onClick={() => { window.location.assign("?pid=" + item.pid); }}>{ item.title }</span>
                                <span style={{ marginLeft: '5px' }}>{ separater }</span>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}