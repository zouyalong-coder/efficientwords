import { Col, Row } from "antd";
import { useState } from "react";
import useSearch from "../hooks/search";
import AddPrefix from "./add_prefix";
import SearchPanel from "./search";
import SearchPrefixPanel from "./search_prefix";





function Page() {
    return (
        <div>
            <SearchPrefixPanel />
            <AddPrefix></AddPrefix>
        </div>
    )
}

export default Page