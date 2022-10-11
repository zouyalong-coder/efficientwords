import { useEffect, useState } from "react"


export default function useData(url: string) {
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
