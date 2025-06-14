export default function Loading() {
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