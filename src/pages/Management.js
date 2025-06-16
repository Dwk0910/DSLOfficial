import $ from 'jquery';

import banner from '../docs/banners/management_banner.png';
import Loading from "../component/Loading";

import {convertDate, getPermission, getType, getType_Req, getURLString} from "../Util";
import {useEffect, useState} from "react";

import sha256 from 'sha256';
import MDEdit from "@uiw/react-md-editor";

export default function Management(props) {
    const userInf = props.userInf;
    const [userList, setUserList] = useState();
    const [postList, setPostList] = useState();
    const [reqList, setReqList] = useState();

    const [mdValue, setMdValue] = useState('');

    useEffect(() => {
        $.ajax({
            type: "POST",
            url: "https://neatorebackend.kro.kr/dslofficial/management/getUserList",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                CTPD: process.env.REACT_APP_CTPD,
                id: userInf["id"]
            })
        }).then((r) => {
            setUserList(JSON.parse(r));
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
                array[i] = JSON.parse(jsonResponse["postList"])[i];
            }

            setPostList(array.reverse());
        });

        $.ajax({
            type: "POST",
            url: "https://neatorebackend.kro.kr/dslofficial/getRequestList",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                CTPD: process.env.REACT_APP_CTPD,
                name: "*"
            })
        }).then((r) => {
            setReqList(JSON.parse(r));
        })
    }, [userInf]);

    if (userInf["perm"] === 3 || userInf["perm"] === 4) {
        window.location.assign(".pid=er403");
        return;
    }

    if (!userList || !postList || !reqList) {
        return (
            <Loading/>
        )
    }

    const mode = getURLString("m");
    let content;

    if (mode === "0") {
        content = (
            <div style={{ width: '100%' }}>
                <h1>메뉴를 선택해 주세요</h1>
            </div>
        );
    }

    if (mode !== "0") {
        switch (mode) {
            case "1": {
                const date = new Date();
                content = (
                    <div style={{ width: '100%' }}>
                        <input type={"button"} value={"유저 추가"} style={{ marginLeft: '15px', marginBottom: '10px' }} onClick={() => {
                            const id = prompt("유저 아이디를 입력하세요");
                            if (id) {
                                const perm = prompt("유저 권한 번호를 입렫력하세요 ([1]일반유저, [2]매니저, [3]관리자, [4]총관리자)");
                                const pwd = sha256("abcd1234");

                                if (!id || !perm) return;

                                $.ajax({
                                    type: "POST",
                                    url: "https://neatorebackend.kro.kr/dslofficial/register",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({
                                        CTPD: process.env.REACT_APP_CTPD,
                                        id: id,
                                        pwd: pwd,
                                        perm: perm,
                                        date: convertDate(date)
                                    })
                                }).then((r) => {
                                    if (JSON.parse(r)["status"] === "true") {
                                        alert("가입 성공");
                                        window.location.reload();
                                    } else if (JSON.parse(r)["status"] === "idexist") {
                                        alert("이미 존재하는 아이디입니다");
                                        window.location.reload();
                                    } else console.log(r);
                                });
                            }
                        }}/>
                        { userList.map((item, idx) => {
                            return (
                                <div key={idx} style={{ width: "80%", fontFamily: 'suite', display: 'flex', flexDirection: 'row', marginLeft: '15px' }}>
                                    <div style={{ width: '150px'}}>{ item["id"] }</div>
                                    <div style={{ width: '100px' }}>{ item["date"] }</div>
                                    <div style={{ width: '100px' }}>{ getPermission(item) }</div>
                                    <div>
                                        <input type={"button"} value={"권한수정"} onClick={() => {
                                            const perm = prompt("유저 권한 번호를 입렫력하세요 ([1]일반유저, [2]매니저, [3]관리자, [4]총관리자)");
                                            if (perm) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "https://neatorebackend.kro.kr/dslofficial/editUserInfo",
                                                    contentType: "application/json; charset=utf-8",
                                                    data: JSON.stringify({
                                                        CTPD: process.env.REACT_APP_CTPD,
                                                        id: item["id"],
                                                        pwd: item["pwd"],
                                                        perm: perm,
                                                        date: "0000-00-00" // dummy
                                                    })
                                                }).then((r) => {
                                                    console.log(r);
                                                    if (JSON.parse(r)["status"] === "true") {
                                                        alert("수정이 완료되었습니다.");
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        }}/>
                                        <input type={"button"} value={"삭제"} style={{ marginLeft: '10px' }} onClick={() => {
                                            if (window.confirm("정말 이 계정을 삭제하시겠습니까?")) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "https://neatorebackend.kro.kr/dslofficial/deleteAccount",
                                                    contentType: "application/json; charset=utf-8",
                                                    data: JSON.stringify({
                                                        CTPD: process.env.REACT_APP_CTPD,
                                                        id: item["id"],
                                                        pwd: item["pwd"]
                                                    })
                                                }).then((r) => {
                                                    if (JSON.parse(r)["status"] === "true") {
                                                        alert("삭제가 완료되었습니다.");
                                                        window.location.reload();
                                                    } else console.log(r);
                                                })
                                            }
                                        }}/>
                                    </div>
                                </div>
                            );
                        }) }
                    </div>
                );
                break;
            }

            case "2": {
                content = (
                    <div style={{ width: '100%' }}>
                        {
                            (postList.length === 0) ? (
                                <h3>게시글이 없습니다.</h3>
                            ) : (
                                postList.map((item, idx) => {
                                    return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ width: '100px', textAlign: 'center' }}>{item["t"]}</div>
                                            <div style={{ width: '100px', textAlign: 'center' }}>{getType(item["type"], false)}</div>
                                            {
                                                (item["type"] === "notification") ?
                                                    (
                                                        <div style={{ width: '600px', fontWeight: 'bold' }}>{item["name"]}</div>
                                                    ) : (
                                                        <div style={{ width: '600px' }}>{item["name"]}</div>
                                                    )
                                            }
                                            <div style={{ width: '150px' }}>{item["author"]}</div>
                                            <div style={{ width: '200px' }}>{item["date"]}</div>
                                            <input type={"button"} value={"삭제"} style={{ marginRight: '20px'}} onClick={() => {
                                                if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "https://neatorebackend.kro.kr/dslofficial/deletePost",
                                                        contentType: "application/json; charset=utf-8",
                                                        data: JSON.stringify({
                                                            CTPD: process.env.REACT_APP_CTPD,
                                                            t: item["t"]
                                                        })
                                                    }).then((r) => {
                                                        if (JSON.parse(r)["status"] === "true") {
                                                            alert("삭제가 완료되었습니다.");
                                                            window.location.reload();
                                                        }
                                                    })
                                                }
                                            }}/>
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                );
                break;
            }

            case "3": {
                const ans = getURLString("ans");
                if (ans !== "0") {
                    if (!reqList[ans - 1]) {
                        window.location.assign(".?pid=er404");
                        return;
                    }

                    document.documentElement.setAttribute("data-color-mode", "light");

                    if (reqList[ans - 1]["response"] !== "") {
                        alert("이미 답변이 완료된 요청입니다.");
                        window.location.assign(".?pid=m&m=3");
                    }

                    content = (
                        <div style={{ width: '100%', fontFamily: 'suite' }}>
                            <span className={"hoverstyle"} onClick={() => {
                                window.location.assign(".?pid=m&m=3");
                            }}>{"< 뒤로가기"}</span>
                            <h1>{`[${getType_Req(reqList[ans - 1]["type"])}] : ${reqList[ans - 1]["date"].replaceAll("-", ".")} (${reqList[ans - 1]["member"]})`}</h1>
                            <div style={{ marginBottom: '5px' }}>- 요청 내용</div>
                            <MDEdit.Markdown source={reqList[ans - 1]["content"]} style={{ border: '1px solid gray', marginBottom: '15px', padding: '1%', fontSize: '1rem' }}/>
                            <div style={{ marginBottom: '5px' }}>- 답변하기</div>
                            <MDEdit height={"600px"} value={mdValue} onChange={setMdValue}/>
                            <input type={"button"} value={"답변하기"} style={{ padding: '1%', fontSize: '1.05rem', fontFamily: 'suite', marginTop: '10px', cursor: 'pointer' }} onClick={() => {
                                if (window.confirm("이 내용으로 답변하시겠습니까?")) {
                                    $.ajax({
                                        type: "POST",
                                        url: "https://neatorebackend.kro.kr/dslofficial/addAnswer",
                                        contentType: "application/json; charset=utf-8",
                                        data: JSON.stringify({
                                            CTPD: process.env.REACT_APP_CTPD,
                                            urid: reqList[ans - 1]["urid"],
                                            answer: mdValue
                                        })
                                    }).then((r) => {
                                        if (JSON.parse(r)["status"] === "true") {
                                            alert("답변을 완료하였습니다.");
                                            window.location.assign(".?pid=m&m=3");
                                        }
                                    });
                                }
                            }}/>
                        </div>
                    );
                } else {
                    content = (reqList.length === 0) ? (
                        <h3>요청이 없습니다.</h3>
                    ) : (
                        <div style={{fontFamily: 'suite'}}>
                            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>- 답변하지 않음</div>
                            {
                                reqList.map((item, idx) => {
                                    if (item["response"] === "") {
                                        return (
                                            <div key={idx}
                                                 style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                                <div style={{width: '100px', marginLeft: '30px'}}>{item["date"]}</div>
                                                <div style={{width: '100px'}}>{getType_Req(item["type"])}</div>
                                                <div>{item["member"]}</div>
                                                <input type={"button"} value={"답변하기"} style={{marginLeft: '20px'}}
                                                       onClick={() => {
                                                           window.location.assign(`.?pid=m&m=3&ans=${idx + 1}`);
                                                       }}/>
                                            </div>
                                        );
                                    } else return (<span key={idx} style={{display: 'none'}}></span>);
                                })
                            }
                            <div style={{fontWeight: 'bold', marginTop: '15px', marginBottom: '5px'}}>- 답변함</div>
                            {
                                reqList.map((item, idx) => {
                                    if (item["response"] !== "") {
                                        return (
                                            <div key={idx}
                                                 style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                                <div style={{width: '100px', marginLeft: '30px'}}>{item["date"]}</div>
                                                <div style={{width: '100px'}}>{item["type"]}</div>
                                                <div>{item["member"]}</div>
                                                <input type={"button"} value={"질문 삭제"} style={{ marginLeft: '25px' }} onClick={() => {
                                                    if (window.confirm("이 질문을 삭제하시겠습니까?")) {
                                                        $.ajax({
                                                            type: "POST",
                                                            url: "https://neatorebackend.kro.kr/dslofficial/deleteRequest",
                                                            contentType: "application/json; charset=utf-8",
                                                            data: JSON.stringify({
                                                                CTPD: process.env.REACT_APP_CTPD,
                                                                urid: item["urid"],
                                                                answer: "" // Dummy
                                                            })
                                                        }).then((r) => {
                                                            if (JSON.parse(r)["status"] === "true") {
                                                                alert("질문글 삭제가 완료되었습니다.");
                                                                window.location.reload();
                                                            } else console.log(r);
                                                        });
                                                    }
                                                }}/>
                                            </div>
                                        );
                                    } else return (<span key={idx} style={{display: 'none'}}></span>);
                                })
                            }
                        </div>
                    );
                }
                break;
            }

            default: {
                window.location.assign(".?pid=er404");
                return;
            }
        }
    }

    const style_unchecked = {
        marginRight: '15px',
        marginLeft: '15px'
    }

    const style_checked = {
        marginRight: '15px',
        marginLeft: '15px',
        fontWeight: 'bold'
    }

    return (
        <div style={{ width: '90.9%', marginTop: '20px' }}>
           <img src={banner} alt={"banner"} width={"100%"}/>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', fontFamily: "suite", marginBottom: '40px' }}>
                <span id={"m1"} className={"hoverstyle"} style={(getURLString("m") === "1") ? style_checked : style_unchecked} onClick={() => window.location.assign(".?pid=m&m=1")}>유저관리</span>
                <span id={"m2"} className={"hoverstyle"} style={(getURLString("m") === "2") ? style_checked : style_unchecked} onClick={() => window.location.assign(".?pid=m&m=2")}>게시글관리</span>
                <span id={"m3"} className={"hoverstyle"} style={(getURLString("m") === "3") ? style_checked : style_unchecked} onClick={() => window.location.assign(".?pid=m&m=3")}>신청센터 답변</span>
            </div>
            {content}
        </div>
    );
}