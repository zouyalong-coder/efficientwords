
const serverHost = "http://127.0.0.1:8080"

const mockData = {
    more: false,
    items: [
        {
            id: 1,
            sign: 'em',
            meanings: ['内']
        },
        {
            id: 2,
            sign: 'en',
            meanings: ['内']
        },
        {
            id: 3,
            sign: 'in',
            meanings: ['内']
        },
    ]
}

export default async function getJsonData(url: string, params?: {} | undefined): Promise<{}> {
    if (!url.startsWith('http')) {
        url = serverHost + url
    }
    if (typeof params !== "undefined") {
        const query = (new URLSearchParams(params)).toString()
        if (query.length > 0) {
            url += "?" + query
        }
    }
    console.log("url: ", url)
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(mockData), 100)
    })
    return await fetch(url)
        .then((resp) => resp.json())
}

