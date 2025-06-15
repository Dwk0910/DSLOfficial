import * as React from 'react';
import { useState } from 'react';

import DDMLogo from '../docs/DDM/DDM_Logo.png';
import DDMUuidExample from '../docs/DDM/DDM_UUID_EXAMPLE.png';

export default function DDM() {
    document.title = "DSL OFFICIAL - DDM [검색]";
    const [searchQuery, setQuery] = useState("");
    const [searchType, setSearchType] = useState("문서 이름으로 검색");

    // 문서 번호검색용 state
    const [clsNumber, setClsNumber] = useState("1");
    const [season, setSeason] = useState("E");
    const [initalWritedDate, setinitalWritedDate] = useState("2025-01-27");
    const [documentUUID, setDocumentUUID] = useState("");
    const [documentStatus, setDocumentStatus] = useState("O");
    const [editNumber, setEditNumber] = useState("");
    const [publicCls, setPublicCls] = useState("1");

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                <img src={DDMLogo} alt="DDMLogo" style={{ width: '100px', height: '100px' }} />
                <span style={{ fontFamily: 'suite', fontSize: '1.5rem', fontWeight: 'bold' }}>DSL Document Management System</span>
            </div>
            <form onSubmit={(e) => {
                if (searchType === "문서 이름으로 검색" && searchQuery.length === 0) alert("검색어를 입력해 주세요.");
                else if (searchType === "문서 등록번호로 검색" &&(
                        clsNumber.length === 0 ||
                        season.length === 0 ||
                        initalWritedDate.length === 0 ||
                        documentUUID.length === 0 ||
                        documentStatus.length === 0 ||
                        editNumber.length === 0 ||
                        publicCls.length === 0
                )) alert("검색조건 중 하나 이상이 비어있습니다.");
                else {
                    alert(`
                    검색방식 : ${searchType}
                    검색어 : ${searchQuery}
                    분류번호 : ${clsNumber}
                    분기 : ${season}
                    최초작성날짜 : ${initalWritedDate}
                    문서고유번호 : ${documentUUID}
                    문서수정상태 : ${documentStatus}
                    수정번호 : ${editNumber}
                    공개구분 : ${publicCls}
                    `);
                }

                e.preventDefault();
            }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div>
                    <select
                        name={"searchOption"}
                        style={{ marginRight: '5px', padding: '10px', fontFamily: 'suite' }}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option>문서 이름으로 검색</option>
                        <option>문서 등록번호로 검색</option>
                    </select>
                </div>
                <div>
                    {searchType === "문서 이름으로 검색" && (
                        <input
                            type="search"
                            value={searchQuery}
                            placeholder="찾으시려는 문서 제목을 입력해 주세요"
                            style={{ width: '500px', height: '40px', fontSize: '1.1rem', fontFamily: 'suite', fontWeight: 'bold', padding: '10px' }}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    )}

                    {searchType === "문서 등록번호로 검색" && (
                        <div style={{ border: '1px solid gray', width: '500px', height: '500px' }}>
                            <img src={DDMUuidExample} alt="DDMExample" style={{ width: '500px' }} />
                            <div style={{ width: '100%', borderBottom: '1px solid gray', marginBottom: '5px' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ marginLeft: '15px', marginBottom: '10px', fontFamily: 'suite', fontWeight: 'bold' }}> - 검색 조건을 입력해주세요 (위의 번호명칭 참고)</span>
                                <div style={{ fontFamily: 'suite' }}>
                                    <span style={{ marginLeft: '28px' }}>분류번호</span>
                                    <select style={{ height: '25px', width: '30px', fontSize: '1.1rem', marginLeft: '15px' }} value={clsNumber} onChange={(e) => setClsNumber(e.target.value)}>
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>분기</span>
                                    <select style={{ height: '25px', fontSize: '1rem', marginLeft: '42px' }} value={season} onChange={(e) => setSeason(e.target.value)}>
                                        {["E", "M", "L"].map(q => <option key={q}>{q}</option>)}
                                    </select>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>최초 작성 날짜</span>
                                    <input type="date" style={{ marginLeft: '10px', fontFamily: 'suite' }} value={initalWritedDate} onChange={(e) => setinitalWritedDate(e.target.value)}/>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>문서번호</span>
                                    <input type="text" style={{ marginLeft: '15px', fontFamily: 'suite' }} value={documentUUID} onChange={(e) => setDocumentUUID(e.target.value)}/>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>관리상태</span>
                                    <select style={{ height: '25px', fontSize: '1rem', marginLeft: '15px' }} value={documentStatus} onChange={(e) => setDocumentStatus(e.target.value)}>
                                        {["O", "E", "C"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>수정번호</span>
                                    <input type="text" style={{ marginLeft: '15px', fontFamily: 'suite', width: '50px' }} value={editNumber} onChange={(e) => setEditNumber(e.target.value)}/>
                                </div>
                                <div style={{ fontFamily: 'suite', marginTop: '10px' }}>
                                    <span style={{ marginLeft: '28px' }}>공개구분</span>
                                    <select style={{ height: '25px', width: '30px', fontSize: '1.1rem', marginLeft: '15px' }} value={publicCls} onChange={(e) => setPublicCls(e.target.value)}>
                                        {[1, 2, 3, 4].map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="submit"
                        value="검색"
                        style={{ width: '100px', height: '40px', marginLeft: '5px', fontFamily: 'suite', fontWeight: 'bold', cursor: 'pointer' }}
                    />
                </div>
            </form>
        </div>
    );
}