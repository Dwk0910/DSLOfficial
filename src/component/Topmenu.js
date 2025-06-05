import * as React from 'react';
import './Topmenu.css';

export default function Topmenu() {
    const menuArray = [
        { pid: 0, title: "HOME" },
        { pid: 1, title: "공지" },
        { pid: 2, title: "게시판" },
        { pid: 3, title: "신청센터" },
        { pid: 4, title: "자료실" },
        { pid: 5, title: "DDM" },
        { pid: 6, title: "DSLHUB" },
        { pid: 'S', title: 'DSLWiki'}
    ];

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style={{ display: 'flex', width: '90%', height: '40px', paddingLeft: '10px', backgroundColor: '#BECCF0', borderRadius: '3px', alignItems: 'center' }}>
                {
                    menuArray.map((item, idx) => {
                        let style = {
                            color: (idx === 0) ? 'green' : 'black',
                            marginLeft: '5px',
                            cursor: 'pointer',
                            fontFamily: 'suite, Gulim'
                        };

                        if (idx === 0 && window.location.search === "") style.fontWeight = 'bold';
                        else if (window.location.search.includes("pid=" + item.pid)) style.fontWeight = 'bold';

                        const separater = (idx === menuArray.length - 1) ? "" : (
                            <span key={idx} style={{ borderRight: "1px solid #9C9C9C", marginLeft: '8px', marginRight: '8px' }}></span>
                        );

                        return (
                            <React.Fragment key={item.pid}>
                                <span key={item.title} className={"menu"} style={style} onClick={() => { window.location.assign("?pid=" + item.pid); }}>{ item.title }</span>
                                <span key={separater.key} style={{ marginLeft: '5px' }}>{ separater }</span>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}