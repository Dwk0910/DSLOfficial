import $ from 'jquery';
import * as React from 'react';
import { useEffect, useState } from 'react';

import sha256 from 'sha256';

import shorticon_1 from '../docs/Main/shortcut_downloadcenter.png';
import shorticon_2 from '../docs/Main/shortcut_applycenter.png';

import { getPermission, getUserInfo, LocalStorage } from "../Util";

import Loading from '../component/Loading';

export default function Main() {
    document.title = "DSL OFFICIAL - HOME";

    const ls = LocalStorage();
    const [userInf, setUserInf] = useState();

    const [postList, setPostList] = useState([]);
    const [loading_post, setLoading_post] = useState(true);

    // check server status
    const [wikiServerStatus, setWikiServerStatus] = useState("🟡 확인 중...");
    const [dcsServerStatus, setDCSServerStatus] = useState("🟡 확인 중...");

    // DCS Check
    useEffect(() => {
        const interval = setInterval(() => {
            fetch("https://api.mcstatus.io/v2/status/java/mcserver.dslofficial.kro.kr")
                .then(res => res.json())
                .then(data => {
                    if (data["online"]) setDCSServerStatus("🟢 온라인");
                    else setDCSServerStatus("🔴 오프라인");
                });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Wiki Check
    function checkWikiServerStatus(){
        fetch("https://wiki.dslofficial.org/ping-wiki.php", { cache: 'no-store' })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                if (data.status === "online") setWikiServerStatus("🟢 온라인");
                else setWikiServerStatus("🔴 오프라인");
            })
            .catch(() => {
                setWikiServerStatus("🔴 오프라인");
                console.warn("위키서버 꺼져있음 : 위에 오류 내가 코딩못해서 나오는게 아니고 위키 서버가 꺼져있어서 나오는거니깐 이걸로 버그제보하지마삼");
            });
    }

    // 초기 1회 실행
    useEffect(() => {
        checkWikiServerStatus();
        setInterval(checkWikiServerStatus, 60000);
    }, []);

    // 60초마다 반복 실행

    useEffect(() => {
        getUserInfo().then((e) => { setUserInf(e); });
    }, []);

    useEffect(() => {
        $.ajax({
            url: "https://neatorebackend.kro.kr/dslofficial/getPostList",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                CTPD: process.env.REACT_APP_CTPD
            })
        }).then((response) => {
            const jsonResponse = JSON.parse(JSON.parse(response)["postList"]);
            const array = [];
            for (let i = 0; i < jsonResponse.length; i++) if (jsonResponse[i]["type"] === "notification") array[i] = jsonResponse[i];
            setPostList(array.reverse());
            setLoading_post(false);
        })
    }, []);

    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    if (!userInf || loading_post) {
        return (<Loading/>);
    }

    let i = 1;
    let notificationContent = [];
    if (postList.length === 0) notificationContent.push(<span key={0} style={{ fontFamily: 'suite', color: 'gray', marginTop: '50px', marginLeft: '-22px', width: '100%', textAlign: 'center' }}>공지가 없습니다.</span>)
    else {
        postList.forEach((post) => {
            if (i <= 3) {
                i++;
                notificationContent.push(
                    <div key={post.t} className={"posthoverstyle"} style={{ width: '95.5%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10px', border: '1px solid gray', borderRadius: '5px', paddingTop: '10px', paddingBottom: '10px', cursor: 'pointer', transition: '.15s ease-in-out' }} onClick={() => {
                        window.location.assign(".?pid=1&t=" + post.t);
                    }}>
                        <span style={{ fontFamily: 'suite', marginLeft: '20px' }}>{ post["author"] }</span>
                        <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px', width: '315px' }}>{ post["name"] }</span>
                        <span style={{ fontFamily: 'suite', marginLeft: '20px', marginRight: '20px' }}>{ post["date"].replaceAll("-", ".") }</span>
                    </div>
                );
            }
        });
    }

    const loginComponent = (userInf["id"] === "userstatus_unlogined") ? (
        <React.Fragment>
            <div style={{ width: '300px', textAlign: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>로그인 · LOG IN</span>
            </div>
            <form onSubmit={(event) => {
                $.ajax({
                    type: "POST",
                    url: "https://neatorebackend.kro.kr/dslofficial/login",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        CTPD: process.env.REACT_APP_CTPD,
                        id: id,
                        pwd: sha256(pwd)
                    })
                }).then((e) => {
                    if (JSON.parse(e).status === "true") {
                        ls.set('id', id);
                        ls.set('pwd', sha256(pwd));
                        window.location.reload();
                    } else {
                        console.log(JSON.parse(e));
                        alert("아이디 또는 비밀번호가 잘못되었습니다.");
                    }
                });
                event.preventDefault();
            }}>
                <input name={"id"} type={"text"} placeholder={"아이디"} style={{ width: '200px', height: '25px', fontFamily: 'suite' }} onChange={(e) => { setId(e.target.value); }}/>
                <input name={"pwd"} type={"password"} placeholder={"비밀번호"} style={{ width: '200px', height: '25px', marginTop: '5px', fontFamily: 'suite' }} onChange={(e) => { setPwd(e.target.value); }}/>
                <input type={"submit"} value={"로그인"} style={{ position: 'absolute', width: '80px', height: '67px', marginLeft: '6px', fontFamily: 'suite', fontWeight: 'bold', marginTop: '-31px', cursor: 'pointer', fontSize: '1.02rem' }}/>
            </form>
            <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 자동로그인이 기본으로 활성화되어 있습니다.</span><br/>
            <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 회원가입은 서버관리자에게 문의바랍니다.</span>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <div style={{ width: '300px', textAlign: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>유저정보 · INFO</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '30px' }}>
                <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '1.2rem' }}>{ ls.get("id") }</span>
                <span style={{ fontFamily: 'suite', fontSize: '0.9rem' }}>{ userInf ? (<span>{ getPermission(userInf) }</span>) : (<span>로딩 중...</span>) }</span>
                <span style={{ fontFamily: 'suite', fontSize: '0.9rem' }}>{ userInf ? (<span>{ userInf["date"].replaceAll("-", ".") } 가입</span>) : (<span>로딩 중...</span>) }</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '30px' }}>
                <input
                    type="button"
                    value="비밀번호 변경"
                    onClick={() => {
                        const bg = document.createElement('div');
                        bg.style.position = 'fixed';
                        bg.style.top = 0;
                        bg.style.left = 0;
                        bg.style.width = '100%';
                        bg.style.height = '100%';
                        bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
                        bg.style.display = 'flex';
                        bg.style.justifyContent = 'center';
                        bg.style.alignItems = 'center';
                        bg.style.zIndex = 9999;

                        const popup = document.createElement('div');
                        popup.style.backgroundColor = 'white';
                        popup.style.padding = '20px';
                        popup.style.borderRadius = '8px';
                        popup.style.display = 'flex';
                        popup.style.flexDirection = 'column';
                        popup.style.alignItems = 'center';

                        const label1 = document.createElement('div');
                        label1.textContent = '바꿀 비밀번호를 입력해 주세요';
                        label1.style.marginBottom = '10px';

                        const input1 = document.createElement('input');
                        input1.type = 'password';
                        input1.style.marginBottom = '10px';
                        input1.style.padding = '5px';

                        const label2 = document.createElement('div');
                        label2.textContent = '비밀번호를 다시 입력해 주세요';
                        label2.style.marginBottom = '10px';

                        const input2 = document.createElement('input');
                        input2.type = 'password';
                        input2.style.marginBottom = '10px';
                        input2.style.padding = '5px';

                        const buttonWrap = document.createElement('div');

                        const okBtn = document.createElement('button');
                        okBtn.textContent = '확인';
                        okBtn.style.marginRight = '10px';
                        okBtn.style.fontFamily = 'suite';
                        okBtn.style.cursor = 'pointer';
                        okBtn.onclick = () => {
                            if (input1.value !== input2.value) {
                                alert('비밀번호가 다릅니다');
                            } else if (input1.value === '' || input2.value === '') {
                                alert('입력란이 비었습니다');
                            } else {
                                $.ajax({
                                    type: "POST",
                                    url: "https://neatorebackend.kro.kr/dslofficial/editUserInfo",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({
                                        CTPD: process.env.REACT_APP_CTPD,
                                        id: userInf["id"],
                                        perm: userInf["perm"],
                                        pwd: sha256(input1.value),
                                        date: "0000-00-00" //dummy
                                    })
                                }).then((r) => {
                                    console.log(r);
                                    if (JSON.parse(r)["status"] === "true") {
                                        alert("변경이 완료되었습니다.");
                                        window.location.reload();
                                    }
                                    document.body.removeChild(bg);
                                });
                            }
                        };

                        const cancelBtn = document.createElement('button');
                        cancelBtn.textContent = '취소';
                        cancelBtn.style.fontFamily = 'suite';
                        cancelBtn.style.cursor = 'pointer';
                        cancelBtn.onclick = () => {
                            document.body.removeChild(bg);
                        };

                        buttonWrap.appendChild(okBtn);
                        buttonWrap.appendChild(cancelBtn);

                        popup.appendChild(label1);
                        popup.appendChild(input1);
                        popup.appendChild(label2);
                        popup.appendChild(input2);
                        popup.appendChild(buttonWrap);

                        bg.appendChild(popup);
                        document.body.appendChild(bg);
                    }}
                    style={{
                        marginRight: '10px',
                        marginTop: '20px',
                        padding: '10px',
                        cursor: 'pointer',
                        fontFamily: 'suite',
                        fontWeight: 'bold'
                    }}
                />
                <input type={"button"} value={"내정보"} onClick={() => { alert("Coming soon!\n개발 중입니다.") }} style={{ marginRight: '10px', marginTop: '20px', padding: '10px', cursor: 'pointer', fontFamily: 'suite', fontWeight: 'bold' }}/>
                <input type={"button"} value={"로그아웃"} onClick={() => {
                    if (window.confirm("정말 로그아웃 하시겠습니까?") === true) {
                        ls.remove("id"); ls.remove("pwd");
                        window.location.reload();
                    }
                }} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer', fontFamily: 'suite', fontWeight: 'bold' }}/>
            </div>
        </React.Fragment>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '90.9%'}}>
            <div className={"menuSection"} style={{ marginTop: '20px' }}>
                <div className={"로그인Area"} style={{ border: '1px solid gray', width: '300px', padding: '10px' }}>
                    { loginComponent }
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px' }}> <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>바로가기</span> <img src={shorticon_1} alt={"downloadcenter"} style={{ width: '320px', marginTop: '10px', cursor: 'pointer' }} onClick={() => {
                    window.location.assign('.?pid=4');
                }}/>
                    <img src={shorticon_2} alt={"applycenter"} style={{ width: '320px', marginTop: '5px', cursor: 'pointer' }} onClick={() => {
                        window.location.assign('.?pid=3');
                    }}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px', paddingBottom: '10px', fontFamily: 'suite' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginBottom: '10px' }}>DSL의 기술개발에 지원해주세요!</span>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px', textAlign: 'left' }}>
                        <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>[APP, MC] Java JDK 17 {"- 환영합니다"}</span>
                        <span>[WEB] JS-REACT</span>
                        <span>[OTHER] (Frontend) HTML, <span style={{ fontWeight: 'bold' }}>CSS</span></span>
                        <span style={{ marginTop: '5px' }}>지금 바로 연락해주세요 : @neatore DM</span>
                        <span style={{ color: 'gray', textDecoration: 'line-through', fontSize: '0.8rem' }}>1인개발 너무힘들어요</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px', paddingBottom: '10px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginBottom: '10px' }}>Credits</span>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontFamily: 'suite', textAlign: 'center', fontWeight: 'bold', color: 'black', textDecoration: 'underline' }}>DSL Website Project</span>
                        <span style={{ textAlign: 'center' }}>2024. 3. 2. ~ </span>
                        <span style={{ textAlign: 'center', color: 'gray' }}>{"- DSL OFFICIAL SERVER -"}</span>
                    </div>
                </div>
            </div>
            <div className={"contentSection"} style={{ marginLeft: '30px', width: '100%' }}>
                <div className={"Notification Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '20px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px' }}>· 최근 공지사항</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '22px', minHeight: "160px", width: '100%' }}>
                        {notificationContent}
                    </div>
                </div>
                <div className={"Server-Status Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '35px', height: '415px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px' }}>· 여기에 뭐넣을지 추천좀</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginLeft: '20px', fontFamily: 'suite' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>· 서버운영현황</span>
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', border: '1px solid gray', padding: '5%', minWidth: '200px', borderRadius: '5px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>DSL CITY SERVER</span>
                            <span style={{ fontSize: '0.9rem' }} className={"hoverstyle"} onClick={() => { navigator.clipboard.writeText("mcserver.dslofficial.kro.kr").then(() => { alert("클립보드에 복사되었습니다."); }); }}>mcserver.dslofficial.kro.kr</span>
                            <span style={{ fontSize: '0.9rem', marginTop: '20px' }}>{ dcsServerStatus }</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', marginLeft: '15px', border: '1px solid gray', padding: '5%', minWidth: '200px', borderRadius: '5px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>DSLWiki</span>
                            <span style={{ fontSize: '0.9rem' }} className={"hoverstyle"} onClick={() => { window.open("https://wiki.dslofficial.org"); }}>https://wiki.dslofficial.org</span>
                            <span style={{ fontSize: '0.9rem', marginTop: '20px' }}>{ wikiServerStatus }</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}