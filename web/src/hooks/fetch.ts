import { useEffect, useState } from "react"

const serverHost = "http://127.0.0.1:8080"

export default function useGetJsonDataFromServer(url: string, params?: {} | undefined) {
    if (url.startsWith('/')) {
        url = serverHost + url
    }
    if (typeof params !== "undefined") {
        const query = (new URLSearchParams(params)).toString()
        if (query.length > 0) {
            url += "?" + query
        }
    }
    const [data, setData] = useState(null)
    useEffect(() => {
        let ignore = false // local variable.
        fetch(url)
            .then((resp) => resp.json())
            .then(json => {
                if (!ignore) {
                    setData(json)
                }
            })
        return () => {
            ignore = true
        }
    }, [url])
    return data
}
