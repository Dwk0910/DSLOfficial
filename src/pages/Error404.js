import error404 from "../docs/error404.gif";

export default function Error404() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid gray', marginTop: '20px', marginBottom: '20px', width: '800px', height: '100%' }}>
            <img src={error404} alt={"error404"} width={"500px"}/>
            <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '-20px' }}>페이지를 찾을 수 없습니다.</span>
            <span style={{ fontFamily: 'suite', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                입력하신 주소의 페이지가 이동되었거나 삭제되어 찾을 수 없습니다.<br/>
                주소가 올바른지 확인하신 후 다시 시도해 주세요.
            </span>
        </div>
    );
}