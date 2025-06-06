import * as React from 'react';
import $ from 'jquery';

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
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        $.ajax({
            url: "https://neatorebackend.kro.kr/dslofficial/getPostList",
            type: "GET",
        }).then((response) => {
            setPostList(JSON.parse(response).reverse());
        });
    }, []);

    // for form
    const [title, setTitle] = useState("");
    const [mdValue, mdSetValue] = useState("");

    let content;

    const target = getURLString("t");
    const editmode = getURLString("editmode");

    if (getURLString("editmode") !== "0") {
        if (target !== "0") {
            if (editmode === "delete") {
                $.ajax({
                    type: "POST",
                    url: "https://neatorebackend.kro.kr/dslofficial/deletePost",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        t: getURLString("t")
                    })
                }).then((response) => {
                    if (JSON.parse(response)["status"] === "true") {
                        alert("게시글이 삭제되었습니다.");
                        window.location.assign(".?pid=1");
                    } else console.log(response);
                });
            }
        }
    } else if (target === 'n') {
         document.title = "DSL OFFICIAL - 공지 [새로운 게시글 작성]";
         document.documentElement.setAttribute('data-color-mode', 'light');

         return (
             <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                 <img src={notification_banner} alt={"banner"} style={{ width: '91%', marginTop: '20px' }}/>
                 <div style={{ border: '1px solid gray', width: '82.9%', height: '100%', marginTop: '15px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px' }}>
                     <form onSubmit={(e) => {
                         if (window.confirm("공지로 등록하시겠습니까?")) {
                             let date = new Date();

                             $.ajax({
                                 type: "POST",
                                 url: "https://neatorebackend.kro.kr/dslofficial/newPost",
                                 contentType: "application/json; charset=utf-8",
                                 data: JSON.stringify({
                                     type: "notification",
                                     name: title,
                                     author: userInf["id"],
                                     date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                                     content: mdValue
                                 })
                             }).then((response) => {
                                 if (JSON.parse(response)["status"] === "true") {
                                     alert("공지 등록이 완료되었습니다.");
                                     window.location.assign(".?pid=1");
                                 } else console.log(response);
                             });
                         }
                         e.preventDefault();
                     }} style={{ marginBottom: '15px' }}>
                         <div style={{ display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px' }}>
                             <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }} onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                         </div>
                         <input type={"text"} style={{ fontFamily: 'suite', fontSize: '1.8rem', fontWeight: 'bold', padding: '1%', width: '97.8%', marginTop: '10px', border: '1px solid gray' }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"제목을 입력해 주세요"}  />
                         <MDEdit style={{ marginTop: '30px', minHeight: '500px' }}
                                 value={mdValue}
                                 onChange={mdSetValue}
                                 textareaProps={{
                                     placeholder: '문서 내용을 입력해 주세요'
                                 }}
                         />
                         <input type={"button"} value={"취소"} style={{ marginTop: '25px', width: "70px", height: '50px', marginRight: '20px', fontSize: '1.1rem', fontFamily: 'suite', cursor: 'pointer' }} onClick={() => { window.location.assign(".?pid=1") }}/>
                         <input type={"submit"} value={"공지 등록하기"} style={{ marginTop: '25px', width: "150px", height: '50px', fontSize: '1rem', fontFamily: 'suite', fontWeight: 'bold', cursor: 'pointer' }}/>
                     </form>
                     <span>
                         <span style={{ fontFamily: 'suite', fontWeight: 'bold', color: 'red' }}>서버법률은 이곳에서도 똑같이 적용됩니다!</span>
                         <span style={{ fontFamily: 'suite', marginLeft: '15px'}}>글 작성에 유의바랍니다.</span>
                     </span>
                 </div>
             </div>
         );
     } else if (target !== '0') {
         if (!postList || postList.length === 0) return;

         let targetContent = postList?.find((e) => e?.t === target);

         if (!targetContent) {
             return;
         }

         document.title = `DSL OFFICIAL - 공지 [${targetContent.name}]`;
         document.documentElement.setAttribute('data-color-mode', 'light');

         content = (
             <React.Fragment>
                 <div style={{ border: '1px solid gray', width: '91%', height: '100%', marginTop: '15px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px' }}>
                         <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }} onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                     </div>
                     <span style={{ fontFamily: 'suite', fontSize: '1.8rem', fontWeight: 'bold' }}>{targetContent.name}</span><br/>
                     <div style={{ marginTop: '5px' }}>
                         <span style={{ fontFamily: 'suite' }}>작성자</span>
                         <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.author}</span>
                         <span style={{ fontFamily: 'suite', marginLeft: '20px' }}>작성일</span>
                         <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.date}</span>
                         <span style={{ fontFamily: 'suite', marginLeft: '20px' }}>작성ID</span>
                         <span style={{ marginLeft: '10px', fontWeight: 'bold', fontFamily: 'suite' }}>{targetContent.t}</span>
                     </div>
                     <span style={{ width: '100%', display: 'block', borderBottom: '1px solid gray', marginTop: '15px' }}></span>
                     {
                         ( targetContent["content"] ) ? (
                             <MDEdit.Markdown source={targetContent["content"]} style={{ marginTop: '10px' }}/>
                         ) : (
                             <span>로딩 중입니다...</span>
                         )
                     }
                 </div>
                 { (targetContent?.author === userInf?.id) ? (
                     <div style={{ display: 'flex', justifyContent: 'right', width: '100%', marginTop: '15px' }}>
                         <input type={"button"} value={"게시글 수정"} style={{ fontSize: '1rem', fontFamily: 'suite', fontWeight: 'bold', cursor: "pointer", paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', paddingBottom: '10px', marginRight: '20px' }} onClick={() => {
                             window.location.assign(`.?pid=1&t=${targetContent.t}&editmode=edit`)
                         }}/>
                         <input type={"button"} value={"게시글 삭제"} style={{ fontSize: '1rem', fontFamily: 'suite', fontWeight: 'bold', cursor: "pointer", paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', paddingBottom: '10px', marginRight: '30px' }} onClick={() => {
                             if (window.confirm("이 게시글을 삭제하시겠습니까?")) window.location.assign(`.?pid=1&t=${targetContent.t}&editmode=delete`)
                         }}/>
                     </div>
                 ) : ("") }
             </React.Fragment>
         );
         return (
             <div style={{ width: '100%', marginTop: '20px', marginLeft: '45px', marginRight: '45px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                 <img src={notification_banner} alt={"banner"} style={{ width: '100%' }}/>
                 { content }
             </div>
         );
    } else {
        let i = 0;
        if (postList) {
            postList.forEach((e) => {
                postComponentList.push(
                    <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid gray', width: '95%', padding: '10px', paddingTop: '10px', paddingBottom: '5px', marginBottom: '5px' }}>
                        <span key={e.type} style={{ fontFamily: 'suite', width: '115px', marginLeft: '5px', fontWeight: 'bold' }}>{(e.type === "notification") ? "공지" : e.type}</span>
                        <span key={e.title} style={{ fontFamily: 'suite', width: '407px' }} className={"hoverstyle"} onClick={() => window.location.assign(".?pid=1&t=" + e.t)}>{e.name}</span>
                        <span key={e.author} style={{ fontFamily: 'suite', width: '185px', textAlign: 'center' }}>{e.author}</span>
                        <span key={e.date} style={{ fontFamily: 'suite', width: '130px', marginLeft: '50px', textAlign: 'center' }}>{e.date}</span>
                    </span>
                    </div>
                );
                i++;
            });
        }

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