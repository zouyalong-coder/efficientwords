import { Input, Form, Layout, Button, Row, Col } from "antd"
import { useState } from "react";
import SearchPanel from "./search";

interface IPrefixResultProps {
    keyword: string, 
    results: any
}

function PrefixResult(props: IPrefixResultProps) {
    return (
        <>
            <Row justify="center">
                <Col span={10}>
                    Got {props.results.length} resuls of: {props.keyword}.
                </Col>
            </Row>
        </>
    )
}

// components.
function SearchPrefixPanel(props: {}) {
    const [currentKeyword, setCurrentKeyword] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const onSearch = (keyword: string): boolean => {
        console.log("onSearch ...", keyword)
        setCurrentKeyword(keyword)
        return false;
    };

    return (
        <div {...props}>
            <SearchPanel onSearch={onSearch}></SearchPanel>
            <PrefixResult keyword={currentKeyword} results={searchResult}></PrefixResult>
        </div>

    )
}


function Page() {
    return (
        <div>
            <SearchPrefixPanel />
        </div>
    )
}

export default Page