import { useEffect, useState } from "react";
import getJsonData from "../helper/fetch";

export default function useSearch(url: string, keyword: string, params?: {}): {} {
    const [data, setData] = useState({})
    useEffect(() => {
        if (keyword === "") {
            return
        }
        let ignore = false // local variable
        getJsonData(url, { keyword, ...params })
            .then((d) => {
                if (!ignore) setData(d)
            })
        return () => { ignore = true }
    }, [url, keyword, params])
    return data
}