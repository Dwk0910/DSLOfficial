export function getURLString(key) {
    const urlSearch = new URLSearchParams(window.location.search);
    return (urlSearch.get(key) === null) ? '0' : urlSearch.get(key);
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
