import $ from 'jquery';

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

const ls = LocalStorage();

export const getUserInfo = () =>
    $.ajax({
        type: "POST",
        url: "https://neatorebackend.kro.kr/dslofficial/login",
        contentType: "application/json; charset=utf-8",
        data: `{"id":"${ls.get("id")}", "pwd":"${ls.get("pwd")}"}`
    }).then(e => ({
        id: ls.get("id"),
        date: JSON.parse(e)["registerDate"],
        perm: JSON.parse(e)["permission"]
    }));

export function getPermission(userInf) {
    if (userInf !== undefined) {
        switch (userInf["perm"]) {
            case "1" : return "일반유저";
            case "2" : return "공지관리자";
            default :
                return "알 수 없음"
        }
    }
}

export function getURLString(key) {
    const urlSearch = new URLSearchParams(window.location.search);
    return (urlSearch.get(key) === null) ? '0' : urlSearch.get(key);
}

export function LocalStorage() {
    return new LocalStorageClass();
}
