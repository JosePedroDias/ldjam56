const u = new URL(location.href);
const search = u.searchParams;

export function getSearchParam(param) {
    return search.get(param);
}

export function setSearchParamAndReload(param, value) {
    search.set(param, value);
    const url = `${window.location.pathname}?${search.toString()}`;
    location.href = url;
}
