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

function encodeToBase64(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
    return btoa(binaryString);
}

function decodeFromBase64(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

export function encodeUrlSafeBase64(str) {
    return encodeToBase64(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export function decodeUrlSafeBase64(base64) {
    let padded = base64
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    while (padded.length % 4 !== 0) {
        padded += '=';
    }
    return decodeFromBase64(padded);
}

export const getUserInfo = () =>
    $.ajax({
        type: "POST",
        url: "https://neatorebackend.kro.kr/dslofficial/login",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            CTPD: process.env.REACT_APP_CTPD,
            id: ls.get("id"),
            pwd: ls.get("pwd")
        })
    }).then(e => {
        if (JSON.parse(e)["status"] === "true") {
            return ({
                id: ls.get("id"),
                date: JSON.parse(e)["registerDate"],
                perm: JSON.parse(e)["permission"]
            });
        } else {
            return ({
                id: "userstatus_unlogined",
                date: "0000-00-00",
                perm: '0'
            });
        }
    });

export function getPermission(userInf) {
    if (userInf !== undefined) {
        switch (userInf["perm"]) {
            case "0" : return "unauthorized";
            case "1" : return "일반유저";
            case "2" : return "매니저";
            case "3" : return "관리자";
            case "4" : return "총관리자";
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

export const getType = (type, isHtoE) => {
    if (isHtoE) {
        switch (type) {
            case "공지": return "notification";
            case "자유": return "free";
            case "질문": return "question";
            case "TMI": return "TMI";
            default: return "undefined";
        }
    } else {
        switch (type) {
            case "notification": return "공지";
            case "free": return "자유";
            case "question": return "질문";
            case "TMI": return "TMI";
            default: return "undefined";
        }
    }
}

export const getType_Req = (typeName) => {
    switch(typeName) {
        case "lawreq_new": return "법률추가신청";
        case "lawreq_delete": return "법률제거신청";
        case "lawreq_edit": return "법률수정신청";
        case "servreq": return "서버건의";
        case "namereq": return "이름변경신청";
        default: return getType;
    }
}

export const shortenText = (text, maxLength = 20) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '..';
    } else {
        return text;
    }
}

export const convertDate = (date_orig) => {
    const year = date_orig.getFullYear(), month = date_orig.getMonth() + 1, day = date_orig.getDate(), hour = date_orig.getHours(), minute = date_orig.getMinutes();
    return `${year}-${month}-${day} ${(hour.toString().length === 1) ? "0" + hour.toString() : hour.toString()}:${(minute.toString().length === 1) ? "0" + minute.toString() : minute.toString()}`;
}