import shorticon_1 from '../docs/Main/shortcut_downloadcenter.png';
import shorticon_2 from '../docs/Main/shortcut_applycenter.png';

export default function Main() {
    document.title = "DSL OFFICIAL - HOME";
    return (
        <div style={{ width: '91%', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
            <div className={"첫번째"} style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={"로그인Area"} style={{ border: '1px solid gray', width: '300px', padding: '10px' }}>
                    <div style={{ width: '300px', textAlign: 'center', marginBottom: '10px' }}>
                        <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>로그인 · LOG IN</span>
                    </div>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <input name={"id"} type={"text"} placeholder={"아이디"} style={{ width: '200px', height: '25px', fontFamily: 'suite' }}/>
                        <input name={"pwd"} type={"password"} placeholder={"비밀번호"} style={{ width: '200px', height: '25px', marginTop: '5px', fontFamily: 'suite' }}/>
                        <input type={"submit"} value={"로그인"} style={{ position: 'absolute', width: '80px', height: '67px', marginLeft: '6px', fontFamily: 'suite', fontWeight: 'bold', marginTop: '-31px', cursor: 'pointer', fontSize: '1.02rem' }}/>
                    </form>
                    <span className={"hoverstyle"} style={{ fontFamily: 'suite', fontSize: '0.8rem', color: 'gray' }}>비밀번호를 잊었습니다</span><br/>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 자동로그인이 기본으로 활성화되어 있습니다.</span><br/>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.8rem', color: 'darkorange' }}>* 회원가입은 서버관리자에게 문의바랍니다.</span>
                </div>
                <div className={"Notification Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px' }}>· 공지사항</span>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '15px', color: 'gray' }}>공지사항이 없습니다.</span>
                </div>
            </div>
            <div className={"두번째"} style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold' }}>바로가기</span>
                    <img src={shorticon_1} alt={"downloadcenter"} style={{ width: '320px', marginTop: '10px', cursor: 'pointer' }} onClick={() => {
                        window.location.assign('.?pid=4');
                    }}/>
                    <img src={shorticon_2} alt={"applycenter"} style={{ width: '320px', marginTop: '5px', cursor: 'pointer' }} onClick={() => {
                        window.location.assign('.?pid=3');
                    }}/>
                </div>
                <div className={"Notification Area"} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '20px' }}>· 인기글</span>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginLeft: '15px', color: 'gray' }}>인기글이 없습니다.</span>
                </div>
            </div>
            <div className={"세번째"} style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '320px', textAlign: 'center', border: '1px solid gray', paddingTop: '10px', marginTop: '10px', paddingBottom: '10px' }}>
                    <span style={{ fontFamily: 'suite', fontWeight: 'bold', marginBottom: '10px' }}>Credits</span>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px', textAlign: 'left' }}>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Frontend :</span> HTML, CSS, JS & React</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Backend  :</span> Not yet</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Hosting  :</span> <a href={"https://vercel.com"}>VERCEL</a> webhosting</span>
                        <span style={{ fontFamily: 'suite' }}><span style={{ fontWeight: 'bold' }}>* Tested  :</span> Chromium Opensource</span>
                    </div>
                </div>
            </div>
        </div>
    );
}