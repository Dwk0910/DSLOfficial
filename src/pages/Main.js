import $ from 'jquery';
import * as React from 'react';
import { useEffect, useState } from 'react';

import sha256 from 'sha256';

import shorticon_1 from '../docs/Main/shortcut_downloadcenter.png';
import shorticon_2 from '../docs/Main/shortcut_applycenter.png';

import { getPermission, getUserInfo, LocalStorage } from "../Util";

export default function Main() {
    document.title = "DSL OFFICIAL - HOME";

    console.log()

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
    useEffect(() => {
        const interval = setInterval(() => {
            const img = new Image();
            img.src = "https://dslwiki.kro.kr/resources/assets/poweredby_mediawiki.svg?nocache=" + Date.now();
            img.onload = () => {
                setWikiServerStatus("🟢 온라인")
            };
            img.onerror = () => {
                setWikiServerStatus("🔴 오프라인");
            };
        });
        return () => clearInterval(interval);
    });

    useEffect(() => {
        getUserInfo().then((e) => { setUserInf(e); });
    }, []);

    useEffect(() => {
        $.ajax({
            url: "https://neatorebackend.kro.kr/dslofficial/getPostList",
            type: "GET"
        }).then((response) => {
            setPostList(JSON.parse(response).reverse());
            setLoading_post(false);
        })
    }, []);

    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    if (!userInf || loading_post) {
        return (
            <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '250px',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                fontFamily: 'suite',
            }}>
                <div className="spinner" style={{
                    width: '60px',
                    height: '60px',
                    border: '6px solid #ddd',
                    borderTop: '6px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <span style={{
                    fontsize: '1.4rem',
                    color: '#333',
                    fontWeight: 'bold'
                }}>
        로딩 중입니다...
                </span>
                <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                </style>
            </div>
        );
    }

    let i = 1;
    let notificationContent = [];
    if (postList.length === 0) notificationContent.push(<span style={{ fontFamily: 'suite', marginLeft: '15px', color: 'gray', marginTop: '50px' }}>공지가 없습니다.</span>)
    else {
        postList.forEach((post) => {
            if (i <= 3) {
                i++;
                notificationContent.push(
                    <div key={post.t} className={"posthoverstyle"} style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10px', border: '1px solid gray', borderRadius: '5px', paddingTop: '10px', paddingBottom: '10px', cursor: 'pointer', transition: '.15s ease-in-out' }} onClick={() => {
                        window.location.assign(".?pid=1&t=" + post.t)
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
                        id: id,
                        pwd: sha256(pwd)
                    })
                }).then((e) => {
                    if (JSON.parse(e).status === "true") {
                        ls.set('id', id);
                        ls.set('pwd', sha256(pwd));
                        window.location.reload();
                    } else alert("아이디 또는 비밀번호가 잘못되었습니다.");
                });
                event.preventDefault();
            }}>
                <input name={"id"} type={"text"} placeholder={"아이디"} style={{ width: '200px', height: '25px', fontFamily: 'suite' }} onChange={(e) => { setId(e.target.value); }}/>
                <input name={"pwd"} type={"password"} placeholder={"비밀번호"} style={{ width: '200px', height: '25px', marginTop: '5px', fontFamily: 'suite' }} onChange={(e) => { setPwd(e.target.value); }}/>
                <input type={"submit"} value={"로그인"} style={{ position: 'absolute', width: '80px', height: '67px', marginLeft: '6px', fontFamily: 'suite', fontWeight: 'bold', marginTop: '-31px', cursor: 'pointer', fontSize: '1.02rem' }}/>
            </form>
            <span className={"hoverstyle"} style={{ fontFamily: 'suite', fontSize: '0.8rem', color: 'gray' }}>비밀번호를 잊었습니다</span><br/>
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
                <span style={{ fontFamily: 'suite', fontSize: '0.9rem' }}>{ userInf ? (<span>{ userInf["date"] } 가입</span>) : (<span>로딩 중...</span>) }</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '30px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
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
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px', paddingBottom: '10px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginBottom: '10px' }}>Credits</span>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px', textAlign: 'left' }}>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Frontend :</span> HTML, CSS, JS & React</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Backend  :</span> JDK17 Springboot</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Hosting  :</span> <a href={"https://vercel.com"}>VERCEL</a> webhosting</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Tested  :</span> Chromium Opensource</span>
                    </div>
                </div>
            </div>
            <div className={"contentSection"} style={{ marginLeft: '30px' }}>
                <div className={"Notification Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '20px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px' }}>· 공지사항</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '22px', minHeight: "160px" }}>
                        {notificationContent}
                    </div>
                </div>
                <div className={"Server-Status Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '35px', height: '250px' }}>
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
                            <span style={{ fontSize: '0.9rem' }} className={"hoverstyle"} onClick={() => { window.open("https://www.dslwiki.kro.kr/"); }}>https://www.dslwiki.kro.kr</span>
                            <span style={{ fontSize: '0.9rem', marginTop: '20px' }}>{ wikiServerStatus }</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}