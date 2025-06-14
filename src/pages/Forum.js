import * as React from "react";
import $ from 'jquery';
import MDEdit from "@uiw/react-md-editor";

import { Trash, Pencil } from 'lucide-react';

import banner from '../docs/banners/freeforum_banner.png';

import Loading from '../component/Loading';

import { useState, useEffect, useCallback } from 'react';
import { decodeUrlSafeBase64, encodeUrlSafeBase64, getType, getURLString, getUserInfo, LocalStorage } from "../Util";

export default function Forum() {

    const [loading, setLoading] = useState(true);
    const [postList, setPostList] = useState(undefined);
    const [userInf, setUserInf] = useState();

    const ls = LocalStorage();
    const [mdValue, setMdValue] = useState((ls.get("edit_content")) ? decodeUrlSafeBase64(ls.get("edit_content")) : '');
    const [title, setTitle] = useState((ls.get("edit_title")) ? decodeUrlSafeBase64(ls.get("edit_title")) : '');
    const [header, setHeader] = useState("자유");

    // For comments
    const [comment, setComment] = useState("");

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
            for (let i = 0; i < jsonResponse.length; i++) {
                if (jsonResponse[i]["type"] !== "notification") array[i] = jsonResponse[i];
            }

            setPostList(array.reverse());
        });
    }, []);

    useEffect(() => {
        if (userInf && postList) setLoading(false);
    }, [userInf, postList])


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
                    <div style={{ textAlign: 'center', width: '100px' }}>{ item["t"] }</div>
                    <div style={{ textAlign: 'center', width: '120px' }}>{ getType(item["type"]) }</div>
                    <div style={{ textAlign: 'left', width: '400px' }} className={"hoverstyle"} onClick={() => window.location.assign(`.?pid=2&t=${item["t"]}`)}>{ item["name"] }</div>
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
                            ) : ("")
                        }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: 'suite', minHeight: '500px', marginTop: '20px' }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '40px', borderBottom: '1px solid gray', borderTop: '1px solid gray' }}>
                            <div style={{ textAlign: 'center', width: '100px' }}>번호</div>
                            <div style={{ textAlign: 'center', width: '120px' }}>말머리</div>
                            <div style={{ textAlign: 'center', width: '400px' }}>제목</div>
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
                const target = postList.find(item => item["t"] === getURLString("et"));
                if (!target) {
                    window.loation.assign(".?pid=er404");
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
                                            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
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
                                <input type={"text"} style={{ fontFamily: 'suite', fontSize: '1.8rem', fontWeight: 'bold', padding: '1%', width: '100%', height: '40px', marginTop: '10px', border: '1px solid gray' }} placeholder={"제목을 입력해 주세요"} value={title} onChange={(e) => setTitle(e.target.value)}/>
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
            document.documentElement.setAttribute("data-color-mode", "light")
            const target = postList?.find((e) => e?.t === getURLString("t"));
            const commentElements = (target["comments"].length !== 0) ? (
                target["comments"].map((e, idx) => {
                    return (
                        <span key={idx} style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '1% 0 1% 0', borderBottom: '1px solid gray' }}>
                            <div style={{ marginLeft: '5px', width: '200px' }}>{ e["author"] }</div>
                            <div style={{ width: '63%', overflowWrap: "break-word" }}>{ e["content"] }</div>
                            <div style={{ marginLeft: '2%' }}>{ e["date"].replaceAll("-", ".") }</div>
                            { (e["author"] === userInf["id"] && e["content"] !== "삭제된 댓글입니다.") ? <span className={"posthoverstyle"} style={{ marginLeft: '7px', height: '30px' }} onClick={() => {
                                if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                    $.ajax({
                                        type: "POST",
                                        url: "https://neatorebackend.kro.kr/dslofficial/deleteComment",
                                        contentType: "application/json; charset=utf-8",
                                        data: JSON.stringify({
                                            CTPD: process.env.REACT_APP_CTPD,
                                            t: getURLString("t"),
                                            idx: idx
                                        })
                                    }).then((r) => {
                                        if (JSON.parse(r)["status"] === "true") {
                                            alert("삭제되었습니다.");
                                            window.location.reload();
                                        }
                                    });
                                }
                            }}><Trash size={20}/></span> : "" }
                        </span>
                    );
                })
            ) : (
                <div style={{ marginTop: '1%' }}>
                    <span>댓글이 없습니다</span>
                </div>
            );

            if (target) {
                return (
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <img src={ banner } alt={"banner"} style={{ width: '91%', marginTop: '20px' }}/>
                        <div style={{ width: '90.9%', borderTop: '1px solid gray', borderBottom: '1px solid gray', marginTop: '20px', padding: '1% 0 1% 0' }}>
                            <span className={"hoverstyle"} style={{ width: '100%', marginLeft: '10px', textAlign: 'left', fontFamily: 'suite', marginBottom: '5px' }} onClick={() => window.location.assign(".?pid=2")}>{"< 돌아가기"}</span>
                        </div>
                        <div style={{ width: '90.9%', display: 'flex', flexDirection: 'column', fontFamily: 'suite', borderTop: '1px solid gray', borderBottom: '1px solid gray', paddingBottom: '15px', marginTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', marginTop: '10px', marginLeft: '15px', fontSize: '1.1rem' }}>{`[${getType(target["type"], false)}] ${target["name"]}`}</span>
                            <div style={{ marginTop: '10px', display: 'flex' }}>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성자</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ target["author"] }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성번호</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ target["t"] }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>작성일</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ target["date"].replaceAll("-", ".") }</span>
                                </span>
                                <span>
                                    <span style={{ marginLeft: '15px' }}>댓글</span>
                                    <span style={{ borderRight: '1px solid gray', padding: '0 15px 0 15px', fontWeight: 'bold' }}>{ target["comments"].length }</span>
                                </span>
                                {
                                    (target["author"] === userInf["id"]) ? (
                                        <div style={{ marginLeft: "250px" }}>
                                            <span className={"postmenuhoverstyle"} onClick={() => {
                                                window.location.assign(`.?pid=2&t=n&et=${getURLString("t")}`);
                                                ls.set("edit_title", encodeUrlSafeBase64(target["name"]));
                                                ls.set("edit_content", encodeUrlSafeBase64(target["content"]));
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
                            <MDEdit.Markdown source={ target["content"] } style={{ width: '100%', marginTop: '15px', minHeight: "500px", borderBottom: '1px solid gray' }}/>
                        </div>
                        <div style={{ marginTop: '10px', borderBottom: '2px solid skyblue', width: '90.9%', paddingBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>전체 댓글</span>
                            <span style={{ marginLeft: '5px', color: 'red', fontWeight: 'bold'}}>{ target["comments"].length }</span>
                            <span style={{ fontWeight: 'bold' }}>개</span>
                        </div>
                        <div style={{ width: '90.9%', marginBottom: '5px', fontFamily: 'suite' }}>
                            {
                                (userInf["id"] === "userstatus_unlogined") ? (
                                    ""
                                ) : (
                                    <form style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', backgroundColor: "rgba(178, 237, 189, 0.4)" }} onSubmit={(e) => {
                                        if (comment === "") {
                                            alert("내용을 입력해주세요");
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
                                                    author: userInf["id"],
                                                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                                                    content: comment
                                                })
                                            }).then((response) => {
                                                if (JSON.parse(response)["status"] === "true") {
                                                    alert("댓글이 등록되었습니다.");
                                                    window.location.reload();
                                                }
                                            });
                                        }

                                        e.preventDefault();
                                    }}>
                                        <span style={{ marginLeft: '1.2%' }}>아이디 <span style={{ fontWeight: 'bold' }}>{userInf["id"]}</span>로 등록됩니다.</span>
                                        <textarea style={{ padding: '5px', marginTop: '10px', height: '50px', margin: '1%', fontFamily: 'suite', fontSize: '1rem', resize: 'none' }} placeholder={"타인의 권리를 침해하거나 명예를 훼손하는 댓글은 서버법률에 따라 처벌 받으실 수 있습니다."} value={comment} onChange={(e) => setComment(e.target.value)}/>
                                        <input type="submit" value={"댓글 등록"} style={{ width: '150px', margin: '1%', padding: '1%', fontFamily: 'suite', fontSize: '1.01rem', fontWeight: 'bold', cursor: 'pointer' }}/>
                                    </form>
                                )
                            }
                            { commentElements }
                        </div>
                    </div>
                )
            } else {
                window.location.assign(".?pid=er404");
                return;
            }
        }
    }
}