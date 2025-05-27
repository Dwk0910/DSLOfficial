export default function Main() {
    document.title = "DSL OFFICIAL - HOME";
    return (
        <div style={{ width: '91%', marginTop: '20px', display: 'flex' }}>
            <div style={{ border: '1px solid gray', width: '300px', padding: '10px' }}>
                <div style={{ width: '300px', textAlign: 'center', marginBottom: '10px' }}>
                    <span style={{ fontFamily: '굴림', fontWeight: 'bold' }}>로그인 · LOG IN</span>
                </div>
                <form onSubmit={(event) => event.preventDefault()}>
                    <input name={"id"} type={"text"} placeholder={"아이디"} style={{ width: '200px', height: '25px', fontFamily: '굴림', fontWeight: 'bold' }}/>
                    <input name={"pwd"} type={"password"} placeholder={"비밀번호"} style={{ width: '200px', height: '25px', marginTop: '5px', fontFamily: '굴림', fontWeight: 'bold' }}/>
                    <input type={"submit"} value={"로그인"} style={{ position: 'absolute', width: '80px', height: '67px', marginLeft: '6px', fontFamily: '굴림', fontWeight: 'bold', marginTop: '-31px' }}/>
                </form>
                <span className={"hoverstyle"} style={{ fontFamily: '굴림', fontSize: '0.8rem', color: 'gray' }}>비밀번호를 잊었습니다</span><br/>
                <span style={{ fontFamily: '굴림', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 자동로그인이 기본으로 활성화되어 있습니다.</span><br/>
                <span style={{ fontFamily: '굴림', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 회원가입은 서버관리자에게 문의바랍니다.</span>
            </div>
            <span style={{ fontFamily: '굴림', fontWeight: 'bold', marginLeft: '20px' }}>· 공지사항</span>
        </div>
    );
}