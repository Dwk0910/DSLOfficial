import * as React from "react";
import $ from 'jquery';
import MDEdit from "@uiw/react-md-editor";

import { Trash, Pencil, CornerDownRight, Crown } from 'lucide-react';

import banner from '../docs/banners/freeforum_banner.png';
import wooah from '../docs/Forum/wooah.png';

import Loading from '../component/Loading';

import { useState, useEffect, useCallback } from 'react';
import {
    convertDate,
    decodeUrlSafeBase64,
    encodeUrlSafeBase64,
    getType,
    getURLString,
    getUserInfo,
    LocalStorage,
    shortenText
} from "../Util";

export default function Forum() {
    document.title = "DSL OFFICIAL - 자유게시판";

    const [commentLengths, setCommentLengths] = useState(undefined);

    // only for ?pid=2
    const [lastWorkDate, setLastWorkDate] = useState(undefined);
    const [postList, setPostList] = useState(undefined);

    // only for ?pid=2&t=XXX
    const [post, setPost] = useState(undefined);
    const [comments, setComments] = useState(undefined);
    const [doubleCommentField, setDoubleCommentField] = useState({});

    const [loading, setLoading] = useState(true);
    const [userInf, setUserInf] = useState();
    const ls = LocalStorage();
    const [mdValue, setMdValue] = useState((ls.get("edit_content")) ? decodeUrlSafeBase64(ls.get("edit_content")) : '');
    const [title, setTitle] = useState((ls.get("edit_title")) ? decodeUrlSafeBase64(ls.get("edit_title")) : '');
    const [header, setHeader] = useState("자유");

    // For comments
    const [comment, setComment] = useState("");
    const [doubleComment, setDoubleComment] = useState("");

    useEffect(() => {
        getUserInfo().then((e) => {
            setUserInf(e);
        });

        $.ajax({
            type: "POST",
            url: "https://neatorebackend.kro.kr/dslofficial/getPostList",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                CTPD: process.env.REACT_APP_CTPD
            })
        }).then((response) => {
            const jsonResponse = JSON.parse(response);
            const array = [];
            for (let i = 0; i < JSON.parse(jsonResponse["postList"]).length; i++) {
                if (JSON.parse(jsonResponse["postList"])[i]["type"] !== "notification") array[i] = JSON.parse(jsonResponse["postList"])[i];
            }

            setPostList(array.reverse());
            setCommentLengths(JSON.parse(jsonResponse["commentLengths"]));
        });

        $.ajax({
            type: "POST",
            url: "https://neatorebackend.kro.kr/dslofficial/getWorkDate"
        }).then((r) => {
            setLastWorkDate(r.split(" ")[0] + " " + r.split(" ")[1]);
        })
    }, []);

    useEffect(() => {
        if (getURLString("t") !== "0" && getURLString("t") !== "n") {
            $.ajax({
                type: "POST",
                url: "https://neatorebackend.kro.kr/dslofficial/getPost",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify({
                    CTPD: process.env.REACT_APP_CTPD,
                    t: getURLString("t"),
                })
            }).then((r) => {
                setPost(JSON.parse(r));
            });

            $.ajax({
                type: "POST",
                url: "https://neatorebackend.kro.kr/dslofficial/getComment",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify({
                    CTPD: process.env.REACT_APP_CTPD,
                    t: getURLString("t")
                })
            }).then((r) => {
                setComments(JSON.parse(r));
            })
        } else {
            setPost('NONE');
            setComments('NONE');
        }
    }, []);

    useEffect(() => {
        if (userInf && postList && post && comments) setLoading(false);
    }, [userInf, postList, post, comments])


    // Event Listener
    const handleBeforeUnload = useCallback((e) => {
        if ((mdValue !== '' || title !== '') && window.location.search.includes("t=n")) {
            e.preventDefault();
            e.returnValue = '';
        }
    }, [mdValue, title]);

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);

    // Render Conditionally
    if (loading) {
        return (<Loading/>);
    }

    // post element array
    let elementArray = [];
    if (postList.length === 0) elementArray[0] = (<div key={0} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'gray', width: '100%' }}>게시글이 없습니다.</div>);
    else {
        postList.forEach((item) => {
            elementArray.push(
                <div key={item["t"]} style={{ width: '100%', display: 'flex', alignItems: 'center', height: '30px', borderBottom: '1px solid gray' }}>
                    <div style={{ textAlign: 'center', width: '80px' }}>{ item["t"] }</div>
                    <div style={{ textAlign: 'center', width: '100px' }}>{ getType(item["type"]) }</div>
                    <div style={{ textAlign: 'left', width: '440px', fontFamily: 'sans-serif', fontSize: '0.92rem' }} className={"hoverstyle"} onClick={() => window.location.assign(`.?pid=2&t=${item["t"]}`)}>
                        {
                            shortenText(item["name"], 32)
                        }
                        {
                            (commentLengths[item["t"]] !== 0) ? (
                                <span style={{ paddingLeft: '5px', color: 'gray' }}>[{commentLengths[item["t"]]}]</span>
                            ) : ""
                        }
                    </div>
                    <div style={{ textAlign: 'center', width: '150px' }}>{ item["author"] }</div>
                    <div style={{ textAlign: 'center', width: '150px' }}>{ item["date"].replaceAll("-", ".") }</div>
                </div>
            );
        });
    }

    // RENDER

    switch (getURLString("t")) {
        case "0": {
            // 기본화면
            return (
                <div style={{ width: '90.9%', marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ display: 'flex', width: '600px', height: '47px', overflow: 'hidden', justifyContent: 'flex-start' }}>
                            <img src={ banner } alt={"banner"} style={{ width: 'auto', height: '100%', objectFit: 'cover' }}/>
                        </div>
                        {
                            (userInf["id"] !== "userstatus_unlogined") ? (
                                <div>
                                    <input type={"button"} value={"게시글 작성"} style={{ fontFamily: 'suite', fontSize: '1.05rem', padding: '4.7%', marginLeft: '50px', width: '200px', cursor: 'pointer' }} onClick={() => window.location.assign(".?pid=2&t=n")}/>
                                </div>
                            ) : ""
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <span style={{ marginTop: '10px', fontFamily: 'suite' }}>최근 활동 : { (lastWorkDate === "0") ? (<span style={{ color: 'gray' }}>없음</span>) : lastWorkDate }</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: 'suite', minHeight: '500px', marginTop: '20px', marginBottom: '20px' }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '40px', borderBottom: '1px solid gray', borderTop: '1px solid gray' }}>
                            <div style={{ textAlign: 'center', width: '80px' }}>작성번호</div>
                            <div style={{ textAlign: 'center', width: '100px' }}>말머리</div>
                            <div style={{ textAlign: 'center', width: '440px' }}>제목</div>
                            <div style={{ textAlign: 'center', width: '150px' }}>글쓴이</div>
                            <div style={{ textAlign: 'center', width: '150px' }}>작성일</div>
                        </div>
                        { elementArray }
                    </div>
                </div>
            );
        }

        case "n": {
            // 게시글 작성/수정화면 (t=n)

            if (userInf["id"] === "userstatus_unlogined") {
                window.location.assign(".?pid=er401");
                return;
            }

            // et !== 0, 게시글 수정 밑작업
            if (getURLString("et") !== "0") {
                const target = postList.find(item => item?.t === getURLString("et"));
                if (!target) {
                    window.location.assign(".?pid=er404");
                    return;
                }

                if (target["author"] !== userInf["id"]) {
                    window.location.assign(".?pid=er403");
                    return;
                }

            }

            // 새로운 게시글 작성화면 (또는 게시글 수정화면)
            document.documentElement.setAttribute("data-color-mode", "light");
            return (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <img src={ banner } alt={"banner"} style={{ width: '91%', marginTop: '20px' }}/>
                    <div style={{ border: '1px solid gray', width: '82.9%', height: '100%', marginTop: '15px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px' }}>
                        <form onSubmit={(e) => {
                            if (title === "" || mdValue === "") {
                                alert("내용을 입력해 주세요");
                                e.preventDefault();
                                return;
                            }

                            if (getURLString("et") === "0") {
                                // 새로운 포스트
                                if (window.confirm("이 내용으로 업로드하시겠습니까?")) {
                                    const date = new Date();

                                    $.ajax({
                                        type: "POST",
                                        url: "https://neatorebackend.kro.kr/dslofficial/newPost",
                                        contentType: "application/json; charset=UTF-8",
                                        data: JSON.stringify({
                                            CTPD: process.env.REACT_APP_CTPD,
                                            type: getType(header, true),
                                            name: title,
                                            author: userInf["id"],
                                            date: convertDate(date),
                                            content: mdValue
                                        })
                                    }).then((r) => {
                                        if (JSON.parse(r)["status"] === "true") {
                                            alert("업로드가 완료되었습니다.");
                                            window.removeEventListener("beforeunload", handleBeforeUnload);
                                            window.location.assign(".?pid=2");
                                        }
                                    });
                                }
                            } else {
                                // 포스트 수정
                                if (window.confirm("수정하시겠습니까?")) {
                                    $.ajax({
                                        type: "POST",
                                        url: "https://neatorebackend.kro.kr/dslofficial/editPost",
                                        contentType: "application/json; charset=UTF-8",
                                        data: JSON.stringify({
                                            CTPD: process.env.REACT_APP_CTPD,
                                            t: getURLString("et"),
                                            name: title,
                                            content: mdValue
                                        })
                                    }).then((r) => {
                                        if (JSON.parse(r)["status"] === "true") {
                                            alert("업로드가 완료되었습니다.");
                                            window.removeEventListener("beforeunload", handleBeforeUnload);
                                            window.location.assign(".?pid=2");
                                        } else console.log(r);
                                    });
                                }
                            }
                            e.preventDefault();
                        }} style={{marginBottom: '15px'}}>
                            <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '35px'}}>
                            <span className={"hoverstyle"} style={{marginBottom: '5px', fontFamily: 'suite'}}
                                  onClick={() => {
                                      if (getURLString("et") === "0") window.location.assign(".?pid=2");
                                      else {
                                          ls.remove("edit_title");
                                          ls.remove("edit_content");
                                          window.location.assign(`.?pid=2&t=${getURLString("et")}`)
                                      }
                                  }}>{"← 돌아가기"}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                <select style={{ width: '23%', marginRight: '2%', fontSize: '1.2rem', padding: '1%', fontFamily: 'suite', height: '58.5px', marginTop: '10px' }} value={header} onChange={(e) => { setHeader(e.target.value) }}>
                                    <option>자유</option>
                                    <option>질문</option>
                                    <option>TMI</option>
                                </select>
                                <input type={"text"} style={{ fontFamily: 'sans-serif', fontSize: '1.7rem', fontWeight: 'bold', padding: '1%', width: '100%', height: '40px', marginTop: '10px', border: '1px solid gray' }} placeholder={"제목을 입력해 주세요"} value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </div>
                            <MDEdit style={{marginTop: '30px', minHeight: '500px'}}
                                    value={ mdValue }
                                    onChange={ setMdValue }
                                    textareaProps={{
                                        placeholder: '문서 내용을 입력해 주세요'
                                    }}
                            />
                            <input type={"button"} value={"취소"} style={{ marginTop: '25px', width: "70px", height: '50px', marginRight: '20px', fontSize: '1.1rem', fontFamily: 'suite', cursor: 'pointer' }} onClick={() => {
                                if (getURLString("et") === "0") window.location.assign(".?pid=2");
                                else window.location.assign(`.?pid=2&et=${getURLString("et")}`);
                            }}/>
                            <input type={"submit"} value={(getURLString("et") !== "0") ? "게시글 수정" : "게시글 업로드"} style={{ marginTop: '25px', width: "150px", height: '50px', fontSize: '1rem', fontFamily: 'suite', fontWeight: 'bold', cursor: 'pointer' }}/>
                        </form>
                        <span>
                         <span style={{ fontFamily: 'suite', fontWeight: 'bold', color: 'red' }}>서버법률은 이곳에서도 똑같이 적용됩니다!</span>
                         <span style={{ fontFamily: 'suite', marginLeft: '15px' }}>글 작성에 유의바랍니다.</span>
                     </span>
                    </div>
                </div>
            );
        }

        default: {
            // 게시글 보기
            document.documentElement.setAttribute("data-color-mode", "light");

            // ==================[ COMMENT ]==================

            let commentElements = [];
            if (commentLengths[post["t"]] !== 0) {
                comments.forEach((e, idx) => {
                    let style = {
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        padding: '1% 0 1% 0',
                        borderBottom: '1px solid gray'
                    }
                    if (e["content"] === "삭제된 댓글입니다.") style["backgroundColor"] = "rgba(0, 0, 0, 0.07)";

                    // 대댓글 Element
                    let doubleCommentElement = [];
                    comments.forEach((doubleComment, doubleCommentIdx) => {
                        if (doubleComment["basedcomment"] === e["ucid"]) {
                            const divStyle = {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: '100%'
                            };

                            doubleCommentElement.push(
                                // 대댓글 출력
                                <div key={doubleCommentIdx} style={divStyle}>
                                    <div style={{
                                        backgroundColor: 'rgba(100, 100, 100, 0.2)',
                                        width: '90%',
                                        padding: "1% 0 1% 0",
                                        borderBottom: '1px solid gray',
                                        display: 'flex'
                                    }}>
                                        <CornerDownRight size={13} style={{marginLeft: '25px', marginRight: '5px', color: '#072bd9'}}/>
                                        <div style={{ width: "120px", display: 'flex', alignItems: 'center' }}>
                                            {doubleComment["author"]}
                                            {(doubleComment["author"] === post["author"]) ? (
                                                <Crown size={10} style={{ color: "#948d00", borderRadius: '50%', padding: '3px', marginRight: '7px', marginLeft: '5px', border: '1px solid yellow' }}/>
                                            ) : ""}
                                        </div>
                                        <div style={{
                                            width: "450px",
                                            overflowWrap: "break-word",
                                            fontFamily: 'sans-serif',
                                            fontSize: '0.95rem'
                                        }}>{doubleComment["content"]}</div>
                                        <div
                                            style={{marginLeft: "20px"}}>{doubleComment["date"].replaceAll("-", ".")}</div>
                                        {(doubleComment["author"] === userInf["id"] && doubleComment["content"] !== "삭제된 댓글입니다.") ?
                                            <span className={"posthoverstyle"} style={{marginLeft: '7px'}}
                                                  onClick={() => {
                                                      if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                                          $.ajax({
                                                              type: "POST",
                                                              url: "https://neatorebackend.kro.kr/dslofficial/deleteComment",
                                                              contentType: "application/json; charset=utf-8",
                                                              data: JSON.stringify({
                                                                  CTPD: process.env.REACT_APP_CTPD,
                                                                  t: getURLString("t"),
                                                                  ucid: doubleComment["ucid"]
                                                              })
                                                          }).then((r) => {
                                                              if (JSON.parse(r)["status"] === "true") {
                                                                  alert("삭제되었습니다.");
                                                                  window.location.reload();
                                                              }
                                                          });
                                                      }
                                                  }}>
                                                <Trash size={16}/>
                                            </span> : ""
                                        }
                                    </div>
                                </div>
                            );
                        }
                    });

                    if (e["basedcomment"] === "none") {
                        // 비로그인 상태, 지워진 댓글에선 대댓추가 불가
                        const canAddDoubleComment = (userInf["id"] !== "userstatus_unlogined" && e["content"] !== "삭제된 댓글입니다.");
                        const contentStyle = (canAddDoubleComment) ? {
                            width: '58%', overflowWrap: "break-word", fontFamily: 'sans-serif', fontSize: '0.95rem', cursor: "pointer"
                        } : {
                            width: '58%', overflowWrap: "break-word", fontFamily: 'sans-serif', fontSize: '0.95rem'
                        };

                        // 일반댓글(답글아님) 출력
                        commentElements.push(
                            <div key={idx}>
                            <span style={style}>
                                <div style={{ marginLeft: '10px', width: "200px", display: 'flex', alignItems: 'center' }}>
                                    {(e["author"] === post["author"]) ? (
                                        <Crown size={10} style={{ color: "#948d00", borderRadius: '50%', padding: '3px', marginRight: '7px', marginLeft: '5px', border: '1px solid yellow' }}/>
                                    ) : ""}
                                    {e["author"]}
                                </div>
                                <div style={ contentStyle }
                                     onClick={() => {
                                         if (canAddDoubleComment) {
                                             // 대댓글 작성 공간 상태 true 추가
                                             setDoubleCommentField(prev => ({
                                                 ...prev,
                                                 [e["ucid"]]: (!doubleCommentField?.[e["ucid"]])
                                             }));
                                         }
                                     }
                                }>{e["content"]}</div>
                                <div style={{ marginLeft: '2%' }}>{e["date"].replaceAll("-", ".")}</div>
                                {(e["author"] === userInf["id"] && e["content"] !== "삭제된 댓글입니다.") ?
                                    <span className={"posthoverstyle"} style={{ marginLeft: '7px' }} onClick={() => {
                                        if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                            $.ajax({
                                                type: "POST",
                                                url: "https://neatorebackend.kro.kr/dslofficial/deleteComment",
                                                contentType: "application/json; charset=utf-8",
                                                data: JSON.stringify({
                                                    CTPD: process.env.REACT_APP_CTPD,
                                                    t: getURLString("t"),
                                                    ucid: e["ucid"]
                                                })
                                            }).then((r) => {
                                                if (JSON.parse(r)["status"] === "true") {
                                                    alert("삭제되었습니다.");
                                                    window.location.reload();
                                                }
                                            });
                                        }
                                    }}><Trash size={16}/></span> : ""
                                }
                            </span>
                                {
                                    (doubleCommentElement.length !== 0) ? (
                                        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                            {doubleCommentElement}
                                        </div>
                                    ) : ""
                                }
                                {
                                    (doubleCommentField?.[e["ucid"]]) ? (
                                        // 대댓글 작성 필드 출력
                                        <div style={{
                                            width: '100%',
                                            backgroundColor: 'rgba(44, 190, 223, 0.2)',
                                            display: 'flex',
                                            flexDirection: "column",
                                            paddingTop: '10px',
                                            margin: '1% 0 1% 0',
                                            border: '1px solid gray'
                                        }}>
                                            <span style={{marginLeft: '1.2%'}}><span
                                                style={{fontWeight: 'bold'}}>{`${e["author"]}`}</span>님에게 답글 남기기</span>
                                            <textarea style={{
                                                padding: '5px',
                                                marginTop: '10px',
                                                height: '50px',
                                                margin: '1%',
                                                fontFamily: 'sans-serif',
                                                fontSize: '0.95rem',
                                                resize: 'none'
                                            }} placeholder={"타인의 권리를 침해하거나 명예를 훼손하는 댓글은 서버법률에 따라 처벌 받으실 수 있습니다."}
                                                      value={doubleComment}
                                                      onChange={(e) => setDoubleComment(e.target.value)}/>
                                            <input type="button" value={"답글 등록"} style={{
                                                width: '150px',
                                                margin: '1%',
                                                padding: '1%',
                                                fontFamily: 'suite',
                                                fontSize: '1.01rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }} onClick={() => {
                                                if (doubleComment === "") {
                                                    alert("내용을 입력해주세요");
                                                    return;
                                                }

                                                if (doubleComment === "삭제된 댓글입니다.") {
                                                    alert("댓글로 등록할 수 없는 내용입니다.");
                                                    return;
                                                }

                                                if (window.confirm("답글로 등록하시겠습니까?")) {
                                                    const date = new Date();
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "https://neatorebackend.kro.kr/dslofficial/addComment",
                                                        contentType: "application/json; charset=utf-8",
                                                        data: JSON.stringify({
                                                            CTPD: process.env.REACT_APP_CTPD,
                                                            t: getURLString("t"),
                                                            basedComment: e["ucid"],
                                                            author: userInf["id"],
                                                            date: convertDate(date),
                                                            content: doubleComment
                                                        })
                                                    }).then((response) => {
                                                        if (JSON.parse(response)["status"] === "true") {
                                                            alert("답글이 등록되었습니다.");
                                                            window.location.reload();
                                                        } else console.log(response);
                                                    });
                                                }
                                            }}/>
                                        </div>
                                    ) : ""
                                }
                            </div>
                        );
                    } else {
                    }
                });
            } else {
                commentElements.push(
                    <div key={0} style={{marginTop: '1%'}}>
                        <span>댓글이 없습니다</span>
                    </div>
                );
            }

            // ==================[ POST ]==================

            if (post) {
                return (
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <img src={ banner } alt={"banner"} style={{ width: '91%', marginTop: '20px' }}/>
                        <div style={{ width: '90.9%', borderTop: '1px solid gray', borderBottom: '1px solid gray', marginTop: '20px', padding: '1% 0 1% 0' }}>
                            <span className={"hoverstyle"} style={{ width: '100%', marginLeft: '10px', textAlign: 'left', fontFamily: 'suite', marginBottom: '5px' }} onClick={() => window.location.assign(".?pid=2")}>{"< 돌아가기"}</span>
                        </div>
                        <div style={{ width: '90.9%', display: 'flex', flexDirection: 'column', fontFamily: 'suite', borderTop: '1px solid gray', borderBottom: '1px solid gray', paddingBottom: '15px', marginTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', marginTop: '10px', marginLeft: '15px', fontFamily: 'sans-serif', fontSize: '1.05rem' }}>{`[${getType(post["type"], false)}] ${post["name"]}`}</span>
                            <div style={{ marginTop: '10px', display: 'flex' }}>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성자</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ post["author"] }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성번호</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ post["t"] }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성일</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ post["date"].replaceAll("-", ".") }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>댓글</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ commentLengths[post["t"]] }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>추천</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ JSON.parse(post["recommend"]).length }</span>
                                </span>
                                {
                                    (post["author"] === userInf["id"]) ? (
                                        <div style={{ marginLeft: "160px" }}>
                                    <span className={"postmenuhoverstyle"} onClick={() => {
                                        window.location.assign(`.?pid=2&t=n&et=${getURLString("t")}`);
                                        ls.set("edit_title", encodeUrlSafeBase64(post["name"]));
                                        ls.set("edit_content", encodeUrlSafeBase64(post["content"]));
                                    }}><Pencil size={20}/></span>
                                            <span className={"postmenuhoverstyle"} style={{ marginLeft: '45px' }} onClick={() => {
                                                if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "https://neatorebackend.kro.kr/dslofficial/deletePost",
                                                        contentType: "application/json; charset=utf-8",
                                                        data: JSON.stringify({
                                                            CTPD: process.env.REACT_APP_CTPD,
                                                            t: getURLString("t"),
                                                        })
                                                    }).then((r) => {
                                                        if (JSON.parse(r)["status"] === "true") {
                                                            alert("게시글이 삭제되었습니다.");
                                                            window.location.assign(".?pid=2");
                                                        } else console.log(r);
                                                    });
                                                }
                                            }}><Trash size={20}/></span>
                                        </div>
                                    ) : (
                                        ""
                                    )
                                }
                            </div>
                        </div>
                        <div style={{ width: '90.9%' }}>
                            <MDEdit.Markdown source={ post["content"] } style={{ width: '100%', marginTop: '15px', minHeight: "500px", paddingBottom: '25px' }}/>
                            {
                                // 비로그인 상태에서는 추천 불가
                                (userInf["id"] !== "userstatus_unlogined") ? (
                                    <div style={{ width: '100%', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ width: '20%', border: '1px solid gray', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3%' }}>
                                            <img alt={"wooah"} src={wooah} className={"posthoverstyle"} width={"50px"} style={{ color: 'white', backgroundColor: '#c9c800', padding: '3%', borderRadius: '5px', marginBottom: '10px' }} onClick={() => {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "https://neatorebackend.kro.kr/dslofficial/newReco",
                                                    contentType: "application/json; charset=utf-8",
                                                    data: JSON.stringify({
                                                        CTPD: process.env.REACT_APP_CTPD,
                                                        t: getURLString("t"),
                                                        id: userInf["id"]
                                                    })
                                                }).then((r) => {
                                                    if (JSON.parse(r)["status"] === "true") {
                                                        alert("이 글을 추천했습니다.");
                                                    } else if (JSON.parse(r)["status"] === "idexist") {
                                                        alert("이 글을 이미 추천하셨습니다.");
                                                    } else console.log(r);
                                                });
                                            }}/>
                                            <span style={{ fontFamily: 'suite' }}>이 글 추천하기</span>
                                        </div>
                                    </div>
                                ) : ""
                            }
                            <div style={{ width: '100%', borderBottom: '1px solid gray' }}></div>
                        </div>
                        <div style={{ marginTop: '10px', borderBottom: '2px solid skyblue', width: '90.9%', paddingBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>전체 댓글</span>
                            <span style={{ marginLeft: '5px', color: 'red', fontWeight: 'bold'}}>{ commentLengths[post["t"]] }</span>
                            <span style={{ fontWeight: 'bold' }}>개</span>
                        </div>
                        <div style={{ width: '90.9%', marginBottom: '5px', fontFamily: 'suite' }}>
                            { commentElements }
                            {
                                (userInf["id"] === "userstatus_unlogined") ? (
                                    ""
                                ) : (
                                    <form style={{ paddingTop: '10px', marginTop: '60px', borderTop: "2px solid skyblue", borderBottom: "2px solid skyblue", display: 'flex', flexDirection: 'column', backgroundColor: "rgba(178, 237, 189, 0.4)" }} onSubmit={(e) => {
                                        if (comment === "") {
                                            alert("내용을 입력해주세요");
                                            e.preventDefault();
                                            return;
                                        }

                                        if (comment === "삭제된 댓글입니다.") {
                                            alert("댓글로 등록할 수 없는 내용입니다.");
                                            e.preventDefault();
                                            return;
                                        }

                                        if (window.confirm("댓글로 등록하시겠습니까?")) {
                                            const date = new Date();
                                            $.ajax({
                                                type: "POST",
                                                url: "https://neatorebackend.kro.kr/dslofficial/addComment",
                                                contentType: "application/json; charset=utf-8",
                                                data: JSON.stringify({
                                                    CTPD: process.env.REACT_APP_CTPD,
                                                    t: getURLString("t"),
                                                    basedComment: "none",
                                                    author: userInf["id"],
                                                    date: convertDate(date),
                                                    content: comment
                                                })
                                            }).then((response) => {
                                                if (JSON.parse(response)["status"] === "true") {
                                                    alert("댓글이 등록되었습니다.");
                                                    window.location.reload();
                                                } else console.log(response);
                                            });
                                        }

                                        e.preventDefault();
                                    }}>
                                        <span style={{ marginLeft: '1.2%' }}>아이디 <span style={{ fontWeight: 'bold' }}>{userInf["id"]}</span>로 등록됩니다.</span>
                                        <textarea style={{ padding: '5px', marginTop: '10px', height: '50px', margin: '1%', fontFamily: 'sans-serif', fontSize: '0.95rem', resize: 'none' }} placeholder={"타인의 권리를 침해하거나 명예를 훼손하는 댓글은 서버법률에 따라 처벌 받으실 수 있습니다."} value={comment} onChange={(e) => setComment(e.target.value)}/>
                                        <input type="submit" value={"댓글 등록"} style={{ width: '150px', margin: '1%', padding: '1%', fontFamily: 'suite', fontSize: '1.01rem', fontWeight: 'bold', cursor: 'pointer' }}/>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                );
            } else {
                window.location.assign(".?pid=er404");
            }
        }
    }
}