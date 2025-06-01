import * as React from 'react';
import { getURLString } from "../Util";
import notification_banner from '../docs/banners/notification_banner.png';

export default function Notification() {
    document.title = "DSL OFFICIAL - 공지";

    let content;

    const target = getURLString("t");
    if (target !== '0') {
        content = (
            <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'left', width: '100%' }}>
                    <span className={"hoverstyle"} style={{ marginBottom: '5px', marginLeft: '20px', fontFamily: 'suite' }} onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                </div>
                <img src={notification_banner} alt={"banner"} style={{ width: '100%' }}/>
                <h1>Reader Target : {target}</h1>
            </React.Fragment>
        );
    } else {
        content = (
            <React.Fragment>
                <img src={notification_banner} alt={"banner"} style={{ width: '97.33%' }}/>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', marginBottom: '5px' }}>
                <span style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid gray', width: '95%', padding: '10px', paddingTop: '10px', paddingBottom: '5px', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'suite', width: '115px', fontWeight: 'bold' }}>글 구분</span>
                    <span style={{ fontFamily: 'suite', width: '500px', textAlign: 'center', fontWeight: 'bold' }}>제목</span>
                    <span style={{ fontFamily: 'suite', width: '170px', fontWeight: 'bold' }}>작성자</span>
                    <span style={{ fontFamily: 'suite', width: '130px', fontWeight: 'bold', textAlign: 'center' }}>작성일</span>
                </span>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid gray', width: '95%', padding: '10px', paddingTop: '10px', paddingBottom: '5px', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'suite', width: '115px', marginLeft: '5px', fontWeight: 'bold' }}>공지</span>
                    <span style={{ fontFamily: 'suite', width: '485px' }} className={"hoverstyle"} onClick={() => window.location.assign(".?pid=1&t=1")}>DSL서버 웹서비스 시작 안내 및 배너 추가 안내</span>
                    <span style={{ fontFamily: 'suite', width: '185px' }}>김동완</span>
                    <span style={{ fontFamily: 'suite', width: '110px' }}>2025.06.02</span>
                </span>
                </div>
            </React.Fragment>
        );
    }

    return (
        <div style={{ width: '100%', marginTop: '20px', marginLeft: '45px', marginRight: '45px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {content}
        </div>
    );
}