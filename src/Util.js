import $ from 'jquery';

export class SimpleExecutor {
    constructor() {
        this.tasks = [];
        this.interval = null;
    }

    submit(task) {
        this.tasks.push(task);
        if (!this.interval) this.run();
    }

    run() {
        this.interval = setInterval(() => {
            if (this.tasks.length === 0) {
                clearInterval(this.interval);
                this.interval = null;
                return;
            }

            const task = this.tasks.shift();
            task(); // 비동기 함수면 task().then() 처리도 가능
        }, 100); // 0.1초 간격으로 하나씩 처리
    }

    shutdown() {
        clearInterval(this.interval);
        this.interval = null;
        this.tasks = [];
    }
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
