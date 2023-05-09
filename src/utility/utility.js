export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

export async function customFetch(token,query) {
    const res = await fetch("https://01.gritlab.ax/api/graphql-engine/v1/graphql",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ query: query }),
    })

    return res
}

export function transactionName(name) {
    let n = name.split("/")

        return n[n.length-1]
}

export function normalize(value,min,max) {
    return (value - min) / (max - min);
}

export function denormalize(value,min,max) {
    return (value * (max - min) + min);
}