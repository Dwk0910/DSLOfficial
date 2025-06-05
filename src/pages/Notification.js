import * as React from 'react';
import notification_banner from '../docs/banners/notification_banner.png';

import { getURLString, getUserInfo, getPermission } from "../Util";

import { useEffect, useState } from 'react';
import MDEdit from '@uiw/react-md-editor';

export default function Notification() {
    document.title = "DSL OFFICIAL - 공지";

    const [userInf, setUserInf] = useState();
    useEffect(() => {
        getUserInfo().then((e) => { setUserInf(e) });
    }, []);

    const perm = getPermission(userInf);
    useEffect(() => {
        if (userInf !== undefined) {
            if (perm !== "공지관리자" && getURLString("t") === "n") {
                alert("Error 403 Forbidden : 당신은 이 페이지에 접근할 권한이 없습니다.");
                window.location.assign(".?pid=1");
            }
        }
    }, [perm, userInf]);

    let postComponentList = [];
    const postList = [
        {
            t: '1',
            type: '공지',
            title: 'DSL웹서비스 시작 및 배너 추가 안내',
            author: 'Dwk0910',
            contents: 'TestContent',
            date: '2025.06.02',
        },
        {
            t: '2',
            type: '공지',
            title: 'DSL웹서비스 시작 안내 및 배너 추가 안내1',
            author: 'Dwk0910',
            contents: 'TestContent',
            date: '2025.06.02'
        },
        {
            t: '3',
            type: '공지',
            title: 'DSL웹서비스 시작 안내 및 배너 추가 안내2',
            author: 'Dwk0910',
            contents: 'TestContent',
            date: '2025.06.02'
        }
    ];

    // for MD Editor
    const [mdValue, mdSetValue] = useState("");

    let content;

    const target = getURLString("t");
     if (target === 'n') {

         document.title = "DSL OFFICIAL - 공지 [새로운 게시글 작성]";
         document.documentElement.setAttribute('data-color-mode', 'light');

         return (
             <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                 <img src={notification_banner} alt={"banner"} style={{ width: '91%', marginTop: '20px' }}/>
                 <div style={{ border: '1px solid gray', width: '82.9%', height: '100%', marginTop: '15px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px' }}>
                         <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }} onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                     </div>
                     <input type={"text"} style={{ fontFamily: 'suite', fontSize: '1.8rem', fontWeight: 'bold', padding: '1%', width: '97.8%', marginTop: '10px', border: '1px solid gray' }} placeholder={"제목을 입력해 주세요"}  />
                     <MDEdit style={{ marginTop: '30px', minHeight: '500px' }}
                             value={mdValue}
                             onChange={mdSetValue}
                             textareaProps={{
                                 placeholder: '문서 내용을 입력해 주세요'
                             }}
                     />
                 </div>
             </div>
         );
     } else if (target !== '0') {
         let targetContent;
         postList.forEach((e) => { if (e.t === target) targetContent = e; });

         document.title = `DSL OFFICIAL - 공지 [${targetContent.title}]`;
         document.documentElement.setAttribute('data-color-mode', 'light');

         if (targetContent === undefined) window.location.assign(".?pid=er404");

         content = (
            <div style={{ border: '1px solid gray', width: '91%', height: '100%', marginTop: '15px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px' }}>
                    <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }} onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                </div>
                <span style={{ fontFamily: 'suite', fontSize: '1.8rem', fontWeight: 'bold' }}>{targetContent.title}</span><br/>
                <div style={{ marginTop: '5px' }}>
                    <span style={{ fontFamily: 'suite' }}>작성자</span>
                    <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.author}</span>
                    <span style={{ fontFamily: 'suite', marginLeft: '20px' }}>작성일</span>
                    <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.date}</span>
                    <span style={{ fontFamily: 'suite', marginLeft: '20px' }}>작성ID</span>
                    <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.t}</span>
                </div>
                <span style={{ width: '100%', display: 'block', borderBottom: '1px solid gray', marginTop: '15px' }}></span>
                <MDEdit.Markdown source={targetContent.contents} style={{ marginTop: '10px' }}/>
            </div>
        );

        return (
            <div style={{ width: '100%', marginTop: '20px', marginLeft: '45px', marginRight: '45px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <img src={notification_banner} alt={"banner"} style={{ width: '100%' }}/>
                { content }
            </div>
        );
    } else {
        let i = 0;
        postList.forEach((e) => {
            postComponentList.push(
                <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid gray', width: '95%', padding: '10px', paddingTop: '10px', paddingBottom: '5px', marginBottom: '5px' }}>
                        <span key={e.type} style={{ fontFamily: 'suite', width: '115px', marginLeft: '5px', fontWeight: 'bold' }}>{e.type}</span>
                        <span key={e.title} style={{ fontFamily: 'suite', width: '407px' }} className={"hoverstyle"} onClick={() => window.location.assign(".?pid=1&t=" + e.t)}>{e.title}</span>
                        <span key={e.author} style={{ fontFamily: 'suite', width: '185px', textAlign: 'center' }}>{e.author}</span>
                        <span key={e.date} style={{ fontFamily: 'suite', width: '130px', marginLeft: '50px', textAlign: 'center' }}>{e.date}</span>
                    </span>
                </div>
            );
            i++;
        });

        const addbtn = (userInf ? getPermission(userInf) === "공지관리자" : false) ? (
            <div style={{ width: '97.33%', marginTop: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'left' }}>
                <input type={"button"} value={"게시글 추가"} style={{ fontSize: '1.03rem', fontFamily: 'suite', padding: '10px', cursor: 'pointer' }} onClick={() => { window.location.assign(".?pid=1&t=n") }}/>
            </div>
        ) : (<div></div>);

        return (
            <div style={{ width: '100%', marginTop: '20px', marginLeft: '45px', marginRight: '45px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <img src={notification_banner} alt={"banner"} style={{ width: '97.33%' }}/>
                { addbtn }
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', marginBottom: '5px' }}>
                    <span style={{ display: 'flex', flexDirection: 'row', borderTop: '1px solid gray', borderBottom: '1px solid gray', width: '95%', padding: '10px', paddingTop: '10px', paddingBottom: '5px', marginBottom: '5px' }}>
                        <span style={{ fontFamily: 'suite', width: '115px', fontWeight: 'bold' }}>글 구분</span>
                        <span style={{ fontFamily: 'suite', width: '500px', textAlign: 'center', fontWeight: 'bold' }}>제목</span>
                        <span style={{ fontFamily: 'suite', width: '170px', fontWeight: 'bold' }}>작성자</span>
                        <span style={{ fontFamily: 'suite', width: '130px', fontWeight: 'bold', textAlign: 'center' }}>작성일</span>
                    </span>
                </div>
                { postComponentList }
            </div>
        );
    }
}