import axios from "axios";


export const SERVER_HOST = "http://127.0.0.1:8080"

function uniformUrl(url: string, params?: {} | undefined): string {
    if (!url.startsWith('http')) {
        url = SERVER_HOST + url;
    }
    if (typeof params !== "undefined") {
        const queryStr = (new URLSearchParams(params)).toString();
        if (queryStr.length > 0) {
            url += queryStr;
        }
    }
    return url
}

function mockPost(url: string) {

}

export async function post(url: string, query?: {} | undefined, body?: any | undefined, headers?: {} | undefined): Promise<any> {
    // let {
    //     url, body, query, headers
    // } = args;
    url = uniformUrl(url, query)
    console.log("post: ", url, body, headers)
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(mockPost(url)), 100)
    })
    return await axios.post(url, body).then(res => res.data)
}


export async function get(url: string, query?: {} | undefined, headers?: {} | undefined): Promise<any> {
    url = uniformUrl(url, query)
    console.log("get: ", url, headers)
    return await axios.get(url).then(res => res.data)
}