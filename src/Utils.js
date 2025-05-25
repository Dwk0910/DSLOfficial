export function Redirect(url, noHistory) {
    (noHistory) ? window.location.replace(url) : window.location.assign(url);
}

export function getPage() {
    const params = new URL(document.location).searchParams;
    const pid = params.get("pid");

    if (pid === null) return "home";
    const intpid = parseInt(pid);

    if (isNaN(intpid)) {
        // 문자 pid 확인

        // default 구문 경고 억제
        // eslint-disable-next-line
        switch (pid) {
            // 신청관련 callback.
            case "req" :
                // default 구문 경고 억제
                // eslint-disable-next-line
                switch (params.get("type")) {
                    case "chgserv": return "chgserv";
                    case "rename": return "rename";
                    case "signup": return "signup";
                }
            break;

            // 마인크래프트 서버관련 callback.
            case "mcserv":
                // default 구문 경고 억제
                // eslint-disable-next-line
                switch (params.get("type")) {
                    case null : return "mcservboard";
                }
            break;

            case "msgbrd" : return "msgbrd";
            case "login" : return "login";
        }
    } else {
        // 숫자 pid 확인

        // default 구문 경고 억제
        // eslint-disable-next-line
        switch (intpid) {
            case 1 : Redirect(".", true); break;
            case 2 : return "alert";
            case 3 : return "law";
            case 4 : return "picture";
        }
    }

    return "error404";
}

class LocalStorageClass {
    set(key, value) {
        localStorage.setItem("dslofficial_" + key, value);
    }

    remove(key) {
        localStorage.removeItem("dslofficial_" + key);
    }

    get(key) {
        return localStorage.getItem("dslofficial_" + key);
    }
}

export function LocalStorage() {
    return new LocalStorageClass();
}