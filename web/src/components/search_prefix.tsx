import { Col, Row } from "antd"
import { useState } from "react";
import useSearch from "../hooks/search";
import SearchPanel from "./search";

interface IPrefixResultProps {
    keyword: string,
    results: any
}

function PrefixResult(props: IPrefixResultProps) {
    return (
        <Row justify="center">
            <Col span={10}>
                Got {JSON.stringify(props.results)} resuls of: {props.keyword}.
            </Col>
        </Row>
    )
}

const QUERY_PREFIX = "/api/query/prefix";

// components.
function SearchPrefixPanel(props: {}) {
    const [currentKeyword, setCurrentKeyword] = useState("")
    const searchResult = useSearch(QUERY_PREFIX, currentKeyword, { test: 1 })
    const onSearch = (keyword: string): boolean => {
        console.log("onSearch ...", keyword)
        setCurrentKeyword(keyword)
        return false;
    };
    console.log("current : ", currentKeyword, searchResult)

    return (
        <div {...props}>
            <SearchPanel onKeyword={onSearch}></SearchPanel>
            <PrefixResult keyword={currentKeyword} results={searchResult}></PrefixResult>
        </div>

    )
}

export default SearchPrefixPanel