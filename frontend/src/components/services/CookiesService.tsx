export const setCookie = (cname: string, cvalue: string) => {
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return true
}

export const getCookie = (cname: string) => {
    // cname is either userId or userToken
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const isThereCookie = () => {
    let userId = getCookie("userId")

    if (userId === "") {
        return false
    } else {
        return true
    }

}

export const deleteCookie = () => {
    document.cookie = "userId=; userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return true
}