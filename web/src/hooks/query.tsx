import { useEffect, useState } from "react";
import getJsonData from "../helper/fetch";

export default function useQuery(url: string, params?: {}): any {
    const [data, setData] = useState({})
    useEffect(() => {
        let ignore = false // local variable
        getJsonData(url, params)
            .then((d) => {
                if (!ignore) setData(d)
            })
        return () => { ignore = true }
    }, [url, params])
    return data
}