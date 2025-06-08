import * as React from 'react';
import $ from 'jquery';
import MDEdit from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';

import notification_banner from '../docs/banners/notification_banner.png';

import { getURLString, getUserInfo, getPermission, LocalStorage, encodeUrlSafeBase64, decodeUrlSafeBase64 } from "../Util";

export default function Notification() {
    document.title = "DSL OFFICIAL - 공지";

    const [loading_user, setLoading_user] = useState(true);
    const [loading_post, setLoading_post] = useState(true);

    const [postList, setPostList] = useState([]);
    let postComponentList = [];

    useEffect(() => {
        $.ajax({
            url: "https://neatorebackend.kro.kr/dslofficial/getPostList",
            type: "GET"
        }).then((response) => {
            setPostList(JSON.parse(response).reverse());
            setLoading_post(false);
        })
    }, []);

    const [userInf, setUserInf] = useState();
    useEffect(() => {
        getUserInfo().then((e) => {
            setUserInf(e);
            setLoading_user(false);
        });
    }, []);

    const perm = React.useMemo(() => getPermission(userInf), [userInf]);
    useEffect(() => {
        if (userInf !== undefined) {
            if (!perm.includes("관리자") && getURLString("t") === "n") {
                window.location.assign(".?pid=er403");
                return (<span></span>);
            }
        }
    }, [perm, userInf]);

    // for form
    const ls = LocalStorage();
    const [title, setTitle] = useState((ls.get("edit_name")) ? decodeUrlSafeBase64(ls.get("edit_name")) : "");
    const [mdValue, setMdValue] = useState((ls.get("edit_content")) ? decodeUrlSafeBase64(ls.get("edit_content")) : "");

    let targetPost = null;

    if (getURLString("name"))

        if (loading_user || loading_post) {
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

    // AFTER LOADING (RENDER)
    let content;

    const target = getURLString("t");
    const editmode = getURLString("editmode");

    if (getURLString("et") !== "0" && getURLString("t") === "n") {
        targetPost = postList.find((e) => e.t === getURLString("et"));
        if (!targetPost) {
            window.location.assign(".?pid=er404");
            return (<span></span>);
        }
    }

    if (getURLString("editmode") !== "0") {
        if (getPermission(userInf) === "unauthorized") {
            window.location.assign(".?pid=er401")
            return;
        } else if (targetPost["author"] === userInf["id"]) {
            window.location.assign(".?pid=er403");
            return;
        }

        if (target !== "0") {
            if (editmode === "delete") {
                let targetContent = postList?.find((e) => e?.t === target);
                if (!targetContent) {
                    window.location.assign(".?pid=er404");
                    return;
                }

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
                        return (<span>삭제완료</span>);
                    } else console.log(response);
                });
            } else {
                window.location.assign(".?pid=er404");
                return (<span>Redirecting...</span>);
            }
        }
    } else if (target === 'n') {
        let editmode = false;
        if (getURLString("et") !== "0") {
            editmode = true;
            document.title = "DSL OFFICIAL - 공지 [게시글 수정]";
        } else document.title = "DSL OFFICIAL - 공지 [새로운 게시글 작성]";

        const back = editmode ? () => {
            ls.remove("edit_name");
            ls.remove("edit_content");
            window.location.assign(".?pid=1&t=" + getURLString("et"));
        } : () => {
            window.location.assign(".?pid=1");
        };

        document.documentElement.setAttribute('data-color-mode', 'light');

        return (
            <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <img src={notification_banner} alt={"banner"} style={{width: '91%', marginTop: '20px'}}/>
                <div style={{
                    border: '1px solid gray',
                    width: '82.9%',
                    height: '100%',
                    marginTop: '15px',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    paddingBottom: '20px'
                }}>
                    <form onSubmit={(e) => {
                        if (editmode) {
                            if (window.confirm("수정하시겠습니까?")) {
                                $.ajax({
                                    type: "POST",
                                    url: "https://neatorebackend.kro.kr/dslofficial/editPost",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({
                                        t: getURLString("et"),
                                        name: title,
                                        content: mdValue
                                    })
                                }).then((response) => {
                                    if (JSON.parse(response)["status"] === "true") {
                                        ls.remove("edit_name");
                                        ls.remove("edit_content");
                                        alert("수정이 완료되었습니다.");
                                        window.location.assign(".?pid=1");
                                    } else alert(response);
                                });
                            }
                            e.preventDefault();
                        } else {
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
                                    } else alert(response);
                                });
                            }
                            e.preventDefault();
                        }
                    }} style={{marginBottom: '15px'}}>
                        <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px'}}>
                            <span className={"hoverstyle"} style={{marginBottom: '5px', fontFamily: 'suite'}}
                                  onClick={() => {
                                      back();
                                  }}>{"← 돌아가기"}</span>
                        </div>
                        <input type={"text"} style={{
                            fontFamily: 'suite',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            padding: '1%',
                            width: '97.8%',
                            marginTop: '10px',
                            border: '1px solid gray'
                        }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"제목을 입력해 주세요"}/>
                        <MDEdit style={{marginTop: '30px', minHeight: '500px'}}
                                value={mdValue}
                                onChange={setMdValue}
                                textareaProps={{
                                    placeholder: '문서 내용을 입력해 주세요'
                                }}
                        />
                        <input type={"button"} value={"취소"} style={{
                            marginTop: '25px',
                            width: "70px",
                            height: '50px',
                            marginRight: '20px',
                            fontSize: '1.1rem',
                            fontFamily: 'suite',
                            cursor: 'pointer'
                        }} onClick={() => {
                            back();
                        }}/>
                        <input type={"submit"} value={(editmode) ? "게시글 수정" : "게시글 업로드"} style={{
                            marginTop: '25px',
                            width: "150px",
                            height: '50px',
                            fontSize: '1rem',
                            fontFamily: 'suite',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}/>
                    </form>
                    <span>
                         <span style={{
                             fontFamily: 'suite',
                             fontWeight: 'bold',
                             color: 'red'
                         }}>서버법률은 이곳에서도 똑같이 적용됩니다!</span>
                         <span style={{fontFamily: 'suite', marginLeft: '15px'}}>글 작성에 유의바랍니다.</span>
                     </span>
                </div>
            </div>
        );
    } else if (target !== '0') {
        let targetContent = postList?.find((e) => e?.t === target);
        if (!targetContent) {
            window.location.assign(".?pid=er404");
            return;
        }

        document.title = `DSL OFFICIAL - 공지 [${targetContent.name}]`;
        document.documentElement.setAttribute('data-color-mode', 'light');
        content = (
            <React.Fragment>
                <div style={{
                    border: '1px solid gray',
                    width: '91%',
                    height: '100%',
                    marginTop: '15px',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    paddingBottom: '20px'
                }}>
                    <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px'}}>
                        <span className={"hoverstyle"} style={{marginBottom: '5px', fontFamily: 'suite'}}
                              onClick={() => window.location.assign(".?pid=1")}>{"← 돌아가기"}</span>
                    </div>
                    <span style={{
                        fontFamily: 'suite',
                        fontSize: '1.8rem',
                        fontWeight: 'bold'
                    }}>{targetContent.name}</span><br/>
                    <div style={{marginTop: '5px'}}>
                        <span style={{fontFamily: 'suite'}}>작성자</span>
                        <span style={{
                            marginLeft: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'suite'
                        }}>{targetContent.author}</span>
                        <span style={{fontFamily: 'suite', marginLeft: '20px'}}>작성일</span>
                        <span style={{
                            marginLeft: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'suite'
                        }}>{targetContent.date.replaceAll("-", ".")}</span>
                        <span style={{fontFamily: 'suite', marginLeft: '20px'}}>작성ID</span>
                        <span style={{
                            marginLeft: '10px',
                            fontWeight: 'bold',
                            fontFamily: 'suite'
                        }}>{targetContent.t}</span>
                    </div>
                    <span style={{
                        width: '100%',
                        display: 'block',
                        borderBottom: '1px solid gray',
                        marginTop: '15px'
                    }}></span>
                    {
                        (targetContent["content"]) ? (
                            <MDEdit.Markdown source={targetContent["content"]}
                                             style={{marginTop: '10px', fontFamily: 'suite', fontSize: '1.1rem'}}/>
                        ) : (
                            <span>로딩 중입니다...</span>
                        )
                    }
                </div>
                {(targetContent?.author === userInf?.id) ? (
                    <div style={{display: 'flex', justifyContent: 'right', width: '100%', marginTop: '15px'}}>
                        <input type={"button"} value={"게시글 수정"} style={{
                            fontSize: '1rem',
                            fontFamily: 'suite',
                            fontWeight: 'bold',
                            cursor: "pointer",
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            marginRight: '20px'
                        }} onClick={() => {
                            ls.set("edit_name", encodeUrlSafeBase64(targetContent.name));
                            ls.set("edit_content", encodeUrlSafeBase64(targetContent.content));
                            window.location.assign(`.?pid=1&t=n&et=${targetContent.t}`);
                            return (<span>EditMode</span>);
                        }}/>
                        <input type={"button"} value={"게시글 삭제"} style={{
                            fontSize: '1rem',
                            fontFamily: 'suite',
                            fontWeight: 'bold',
                            cursor: "pointer",
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            marginRight: '30px'
                        }} onClick={() => {
                            if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
                                window.location.assign(`.?pid=1&t=${targetContent.t}&editmode=delete`);
                                return (<span>DeleteMode</span>);
                            }
                        }}/>
                    </div>
                ) : ("")}
            </React.Fragment>
        );
        return (
            <div style={{
                width: '100%',
                marginTop: '20px',
                marginLeft: '45px',
                marginRight: '45px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <img src={notification_banner} alt={"banner"} style={{width: '100%'}}/>
                {content}
            </div>
        );
    } else {
        let i = 0;
        if (postList) {
            postList.forEach((e) => {
                postComponentList.push(
                    <div key={i}
                         style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <span style={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderBottom: '1px solid gray',
                            width: '95%',
                            padding: '10px',
                            paddingTop: '10px',
                            paddingBottom: '5px',
                            marginBottom: '5px'
                        }}>
                            <span key={e.type} style={{
                                fontFamily: 'suite',
                                width: '115px',
                                marginLeft: '5px',
                                fontWeight: 'bold'
                            }}>{(e.type === "notification") ? "공지" : e.type}</span>
                            <span key={e.title} style={{fontFamily: 'suite', width: '407px'}} className={"hoverstyle"}
                                  onClick={() => window.location.assign(".?pid=1&t=" + e.t)}>{e.name}</span>
                            <span key={e.author}
                                  style={{fontFamily: 'suite', width: '185px', textAlign: 'center'}}>{e.author}</span>
                            <span key={e.date} style={{
                                fontFamily: 'suite',
                                width: '130px',
                                marginLeft: '50px',
                                textAlign: 'center'
                            }}>{e.date.replaceAll("-", ".")}</span>
                        </span>
                    </div>
                );
                i++;
            });
        }

        const addbtn = (userInf ? getPermission(userInf).includes("관리자") : false) ? (
            <div style={{
                width: '97.33%',
                marginTop: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'left'
            }}>
                <input type={"button"} value={"게시글 추가"}
                       style={{fontSize: '1.03rem', fontFamily: 'suite', padding: '10px', cursor: 'pointer'}}
                       onClick={() => {
                           window.location.assign(".?pid=1&t=n")
                       }}/>
            </div>
        ) : (<div></div>);

        return (
            <div style={{
                width: '100%',
                marginTop: '20px',
                marginLeft: '45px',
                marginRight: '45px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <img src={notification_banner} alt={"banner"} style={{width: '97.33%'}}/>
                {addbtn}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '5px',
                    marginBottom: '5px'
                }}>
            <span style={{
                display: 'flex',
                flexDirection: 'row',
                borderTop: '1px solid gray',
                borderBottom: '1px solid gray',
                width: '95%',
                padding: '10px',
                paddingTop: '10px',
                paddingBottom: '5px',
                marginBottom: '5px'
            }}>
                <span style={{fontFamily: 'suite', width: '115px', fontWeight: 'bold'}}>글 구분</span>
                <span style={{fontFamily: 'suite', width: '500px', textAlign: 'center', fontWeight: 'bold'}}>제목</span>
                <span style={{fontFamily: 'suite', width: '170px', fontWeight: 'bold'}}>작성자</span>
                <span style={{fontFamily: 'suite', width: '130px', fontWeight: 'bold', textAlign: 'center'}}>작성일</span>
            </span>
                </div>
                {
                    (postComponentList.length === 0) ? (
                        <div style={{marginTop: '50px'}}>
                            <span style={{fontFamily: 'suite', color: 'gray'}}>공지가 없습니다.</span>
                        </div>
                    ) : postComponentList
                }
            </div>
        );
    }
}