import * as React from 'react';
import $ from 'jquery';

import MDEdit from '@uiw/react-md-editor';

import {getURLString, getUserInfo, getType_Req, convertDate} from '../Util';
import reqcentre_banner from '../docs/banners/reqcentre_banner.png';

import Loading from '../component/Loading';

export default function ReqCentre() {
    document.title = "DSL OFFICIAL - 신청센터"

    const [userInf, setUserInf] = React.useState();
    const [mdValue, setMdValue] = React.useState('');
    const [reqList, setReqList] = React.useState();

    React.useEffect(() => {
        getUserInfo().then((e) => {
            setUserInf(e);
        });
    }, []);

    React.useEffect(() => {
        if (userInf) {
            $.ajax({
                type: "POST",
                url: "https://neatorebackend.kro.kr/dslofficial/getRequestList",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify({
                    CTPD: process.env.REACT_APP_CTPD,
                    name: userInf["id"]
                })
            }).then((response) => {
                setReqList(JSON.parse(response).reverse());
            });
        }
    }, [userInf]);

    // EventListener
    const handleBeforeUnload = React.useCallback((e) => {
        if ((mdValue !== '') && window.location.search.includes("t=2")) {
            e.preventDefault();
            e.returnValue = '';
        }
    }, [mdValue]);

    React.useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);


    if (!userInf || !reqList) return (<Loading/>);

    // RENDER

    if (userInf["id"] === "userstatus_unlogined") {
        alert("로그인이 필요한 서비스입니다.");
        window.location.assign(".");
        return;
    }

    let page;
    const target = getURLString("t");

    if (target === "0") {
        page = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingTop: '3%' }}>
                <span className={"posthoverstyle"} style={{ border: '1px solid gray', fontFamily: 'suite', fontWeight: 'bold', padding: '1%', paddingRight: '0', width: '90%', fontSize: '1.3rem', borderRadius: '10px' }} onClick={() => window.location.assign(".?pid=3&t=chk")}>보낸 요청 보기</span>
                <span className={"posthoverstyle"} style={{ border: '1px solid gray', fontFamily: 'suite', fontWeight: 'bold', padding: '1%', paddingRight: '0', width: '90%', fontSize: '1.3rem', borderRadius: '10px', marginTop: '40px', backgroundColor: 'lightgray' }} onClick={() => window.location.assign(".?pid=3&t=1")}>📖│법률신청</span>
                <span className={"posthoverstyle"} style={{ border: '1px solid gray', fontFamily: 'suite', fontWeight: 'bold', padding: '1%', paddingRight: '0', width: '90%', fontSize: '1.3rem', borderRadius: '10px', marginTop: '10px' }} onClick={() => window.location.assign(".?pid=3&t=2")}>📬│서버건의함</span>
                <span className={"posthoverstyle"} style={{ border: '1px solid gray', fontFamily: 'suite', fontWeight: 'bold', padding: '1%', paddingRight: '0', width: '90%', fontSize: '1.3rem', borderRadius: '10px', marginTop: '10px' }} onClick={() => window.location.assign(".?pid=3&t=3")}>🎭│이름변경신청</span>
            </div>
        );
    } else if (target === "1") {
        // 개발 중
        alert("개발 중입니다");
        window.location.assign(".?pid=3");
        return;

        // document.title = "DSL OFFICIAL - 신청센터 [법률신청]"
        // document.documentElement.setAttribute('data-color-mode', 'light');
        // page = (
        //     <div style={{ display: 'flex', marginTop: '15px', flexDirection: 'column' }}>
        //         <span className={"hoverstyle"} style={{marginBottom: '5px', fontFamily: 'suite'}}
        //               onClick={() => window.location.assign(".?pid=3")}>{"← 돌아가기"}</span>
        //         <MDEdit.Markdown source={"## 📖 법률신청\n> [서버법률 보기](https://docs.google.com/document/d/1ivOiB7EnF-knmYBR1-c0SK3XVHUbKE-G9YoAsGYkL-U/edit?usp=sharing)<br/>\n\nDSL의 서버법률은 **멤버들의 의견**도 적극 반영됩니다. 법률의 수정이나 추가, 제거요청을 원하시는 분들은 아래 양식을 통해 관리자에게 알려주세요!"} style={{ width: '100%', fontFamily: 'suite' }}/>
        //         <div style={{ width: '100%', borderTop: '1px solid gray', marginTop: '20px' }}></div>
        //         <form>
        //             <select style={{ fontSize: '1rem', padding: '5px', fontFamily: 'suite' }}>
        //                 <option>추가신청</option>
        //                 <option>제거신청</option>
        //                 <option>변경신청</option>
        //             </select>
        //         </form>
        //     </div>
        // );
    } else if (target === "2") {
        // 서버건의함
        document.documentElement.setAttribute('data-color-mode', 'light');
        page = (
                <div style={{ display: 'flex', marginTop: '15px', flexDirection: 'column' }}>
                    <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }}
                          onClick={() => window.location.assign(".?pid=3")}>{"← 돌아가기"}</span>
                    <MDEdit.Markdown source={"## 📬 서버건의함\n서버 건의를 위한 창구입니다. 서버 내에서 바라는 점이 있다면 언제든지 신청해주세요!<br/>\n***관련 내용은 관리자에게만 전송됩니다!***<br/>\n- 실현 불가능한 것은 건의하지 말아주세요. (예) 서버인원 전체에게 치킨 한마리씩 돌리기\n- 건의한 내용이 잘 받아들여지지 않는 것 같다면 매니저에게 물어보세요!<br/>매니저들이 친절하게 답변해 줄 거예요.\n- 빠른 반영을 위해 디스코드에서 관리자 맨션 한번씩만 부탁드립니다.\n- `서버법률 제 3조 9항`에 따라, **의미없는 요청을 보내실 경우 처벌받으실 수 있습니다.**\n- **신청을 할땐 예의를 차립시다.**"} style={{ width: '100%', fontFamily: 'suite' }}/>
                    <div style={{ width: '100%', borderTop: '1px solid gray', marginTop: '20px' }}></div>
                    <span style={{ fontFamily: 'suite', padding: '2%' }}>
                            <span>디스코드 아이디인 </span>
                            <span style={{ fontWeight: 'bold'}}>{userInf["id"]}</span>
                            <span>으로 요청됩니다.</span>
                    </span>
                    <form style={{ padding: '2%', paddingTop: 0 }} onSubmit={(e) => {
                        if (mdValue.length === 0) {
                            alert("건의 내용을 입력해주세요");
                            e.preventDefault();
                            return;
                        }

                        if (window.confirm("이 내용으로 서버에 건의하시겠습니까?")) {
                            const date = new Date();
                            $.ajax({
                                type: "POST",
                                url: "https://neatorebackend.kro.kr/dslofficial/newRequest",
                                contentType: "application/json; charset=UTF-8",
                                data: JSON.stringify({
                                    CTPD: process.env.REACT_APP_CTPD,
                                    type: "servreq",
                                    member: userInf["id"],
                                    date: convertDate(date),
                                    content: mdValue
                                })
                            }).then((response) => {
                                if (JSON.parse(response)["status"] === "true") {
                                    alert("건의가 완료되었습니다.");
                                    window.removeEventListener("beforeunload", handleBeforeUnload);
                                    window.location.assign(".?pid=3");
                                } else console.log(response);
                            });
                        }
                        e.preventDefault();
                    }}>
                        <MDEdit value={mdValue}
                                onChange={(e) => setMdValue(e)}
                                style={{ minHeight: '550px' }}
                                textareaProps={{ placeholder: "건의 내용을 입력해 주세요" }}
                        />
                        <input type={"submit"} value={"서버에 건의하기"} style={{ marginTop: '20px', fontFamily: 'suite', padding: '1%', fontWeight: 'bold', cursor: 'pointer' }}/>
                    </form>
                </div>
        );
    } else if (target === "3") {
        // 이름 변경 신청
        document.documentElement.setAttribute('data-color-mode', 'light');
        page = (
            <div style={{ display: 'flex', marginTop: '15px', flexDirection: 'column' }}>
                    <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }}
                          onClick={() => window.location.assign(".?pid=3")}>{"← 돌아가기"}</span>
                <MDEdit.Markdown source={"## 🎭 이름변경신청\n디스코드 아이디 변경 신청은 이곳에서 받고 있습니다.<br/>\n***관련 내용은 관리자에게만 전송됩니다!***<br/>\n- 이름(닉네임)은 되도록 12글자가 넘지 않게 짓도록 합니다.\n- 닉네임에 많은 사람이 불쾌해할 수 있는 단어가 들어가서는 안됩니다.\n- 장난식 닉네임이나 사람을 전혀 알아볼 수 없는 닉네임으로 짓는 경우 기각될 수 있습니다.\n- 닉네임에는 공백문자, 특수문자 등을 사용하지 않아야 합니다.\n- 영어닉네임은 환영입니다.\n- **신청을 할땐 예의를 차립시다.**"} style={{ width: '100%', fontFamily: 'suite' }}/>
                <div style={{ width: '100%', borderTop: '1px solid gray', marginTop: '20px' }}></div>
                <span style={{ fontFamily: 'suite', padding: '2%' }}>
                            <span>디스코드 아이디인 </span>
                            <span style={{ fontWeight: 'bold'}}>{userInf["id"]}</span>
                            <span>으로 요청됩니다.</span>
                </span>
                <form style={{ padding: '2%', paddingTop: 0 }} onSubmit={(e) => {
                    console.log(e.target.querySelector('#t').value);
                    if (e.target.querySelector('#t').value === '') {
                        alert("바꿀 닉네임을 입력해주세요");
                        e.preventDefault();
                        return;
                    }

                    if (window.confirm("이 아이디로 요청하시겠습니까?")) {
                        const date = new Date();
                        $.ajax({
                            type: "POST",
                            url: "https://neatorebackend.kro.kr/dslofficial/newRequest",
                            contentType: "application/json; charset=UTF-8",
                            data: JSON.stringify({
                                CTPD: process.env.REACT_APP_CTPD,
                                type: "namereq",
                                member: userInf["id"],
                                date: convertDate(date),
                                content: `아이디 변경 요청 : ${e.target.querySelector("#t").value}`
                            })
                        }).then((response) => {
                            if (JSON.parse(response)["status"] === "true") {
                                alert("아이디 변경 요청이 완료되었습니다.");
                                window.location.assign(".?pid=3");
                            } else console.log(response);
                        });
                    }
                    e.preventDefault();
                }}>
                    <input type={"text"} id={"t"} placeholder={"바꿀 닉네임을 입력해주세요"} style={{ padding: '1%', fontFamily: 'suite', fontSize: '1.03rem', width: '50%' }}/><br/>
                    <input type={"submit"} value={"아이디 변경 신청"} style={{ marginTop: '20px', fontFamily: 'suite', padding: '1%', fontWeight: 'bold', cursor: 'pointer' }}/>
                </form>
            </div>
        )
    } else if (target === "chk") {
        // 보낸 요청 보기
        document.documentElement.setAttribute('data-color-mode', 'light');

        let content;

        if (reqList.length === 0) {
            content = (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'gray', fontFamily: 'suite', paddingTop: '50px' }}>
                    요청이 없습니다.
                </div>
            );
        } else {
            // 보낸 요청 보기 (상세)
            if (getURLString("s") !== "0") {
                if (!reqList[parseInt(getURLString("s")) - 1]) {
                    window.location.assign(".?pid=er404");
                    return;
                }

                content = (
                    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'suite' }}>
                        <div>
                            <span>요청일 : </span>
                            <span style={{ marginLeft: '15px', fontWeight: 'bo' }} >{ reqList[parseInt(getURLString("s")) - 1]["date"].replaceAll("-", ".") }</span>
                        </div>
                        <div>
                            <span>요청구분 : </span>
                            <span style={{ marginLeft: '15px', fontWeight: 'bold' }} >{ getType_Req(reqList[parseInt(getURLString("s")) - 1]["type"]) }</span>
                        </div>
                        <div>
                            <span>요청인 : </span>
                            <span style={{ marginLeft: '15px', fontWeight: 'bold' }} >{ reqList[parseInt(getURLString("s")) - 1]["member"] }</span>
                        </div>
                        <span>요청내용 : </span>
                        { <MDEdit.Markdown source={reqList[parseInt(getURLString("s")) - 1]["content"]} style={{ marginTop: '15px', marginBottom: '15px', padding: '1%', border: '1px solid gray', fontFamily: 'suite' }}/> }
                        <span>답변 : </span>
                        { (reqList[parseInt(getURLString("s")) - 1]["response"].length !== 0) ? <MDEdit.Markdown source={reqList[parseInt(getURLString("s")) - 1]["response"]}   style={{ marginTop: '15px', marginBottom: '15px', padding: '1%', border: '1px solid gray', fontFamily: 'suite' }}/> : <span>답변이 없습니다</span>}
                    </div>
                );
            } else {
                // 보낸 요청 보기 (리스트)
                content = (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'suite' }}>
                        {
                            reqList.map((item, idx) => {
                                return (
                                    <div key={idx} className={"posthoverstyle"} style={{ display: 'flex', padding: '1%', width: '90%', border: '1px solid gray', marginTop: '10px', borderRadius: '5px' }} onClick={() => window.location.assign(`.?pid=3&t=chk&s=${idx + 1}`)}>
                                        <div style={{ width: '100px', marginLeft: '10px', marginRight: '25px', fontWeight: 'bold', textAlign: 'center' }}>{ getType_Req(item["type"]) }</div>
                                        <div style={{ width: '500px' }}>({item["date"].replaceAll("-", ".")}에 전송)</div>
                                        <div>답변여부</div>
                                        <div style={{ fontWeight: 'bold', marginLeft: '10px' }}>{ (item["response"]) ? "예" : "아니요"}</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            }
        }

        page = (
            <div style={{ display: 'flex', marginTop: '15px', flexDirection: 'column' }}>
                <span className={"hoverstyle"} style={{ marginBottom: '5px', fontFamily: 'suite' }} onClick={() => (getURLString("s") !== "0") ? window.location.assign(".?pid=3&t=chk") : window.location.assign(".?pid=3")}>{"← 돌아가기"}</span>
                <MDEdit.Markdown source={"## 보낸 요청"} style={{ width: '100%', fontFamily: 'suite' }}/>
                <div style={{ width: '100%', marginTop: '20px' }}></div>
                { content }
            </div>
        );
    }

    return (
        <div style={{ width: '90.9%', marginTop: '15px' }}>
            <img src={reqcentre_banner} alt={"banner"} width={"90.9%"}/>
            { page }
        </div>
    );
}