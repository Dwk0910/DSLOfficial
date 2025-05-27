export function getURLString(key) {
    const urlSearch = new URLSearchParams(window.location.search);
    return (urlSearch.get(key) === null) ? '0' : urlSearch.get(key);
}
