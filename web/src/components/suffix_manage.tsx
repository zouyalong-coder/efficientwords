import { Button, Modal, Table, Tag, Typography } from "antd";
import { useState } from "react";
import AddSuffix from "./suffix_add";
import ModifySuffix from "./suffix_modify";

interface PartOfSpeech {
    type: number,
    desc?: string,
}

interface SuffixRow {
    id: number,
    defaultSpell: string,
    spells?: string[],
    meanings: string[],
    partOfSpeech?: PartOfSpeech[],
}

const SuffixTable = (props: { data: SuffixRow[], onModify?: (idx: number, newData: any) => void }) => {
    const [modifying, setModifying] = useState({
        modifying: false,
        data: null,
    })
    const [adding, setAdding] = useState(
        false
    )
    const suffixModified = (newData) => {
        console.log("modified: ", newData)
        const idx = props.data.findIndex((val: SuffixRow, index: number) => {
            console.log("current: ", index, val)
            if (val.id === newData.id) {
                return true;
            }
            return false
        })
        props.onModify && props.onModify(idx, newData)
    }
    const suffixAdded = (newData) => {
        console.log("added: ", newData)
    }
    const edit = (record: SuffixRow) => {
        console.log("edit record:", record)
        setModifying({
            modifying: true,
            data: record,
        })
    }
    const columns = [
        {
            dataIndex: "defaultSpell",
            title: "Spell",
        },
        {
            dataIndex: "spells",
            title: "Other spells",
            render: (_, { spells }) => (
                <>
                    {
                        spells.map((spell) => {
                            return <Tag
                                key={spell}>
                                {spell}
                            </Tag>
                        })
                    }
                </>
            ),
        },
        {
            dataIndex: "meanings",
            title: "Meanings",
            render: (_, { meanings }) => <>
                {
                    meanings.map((item: string, idx: number) => <p key={idx}>{item}</p>)
                }
            </>,
        },
        {
            dataIndex: "operation",
            title: "operation",
            render: (_: any, record: SuffixRow) => (
                <Typography.Link onClick={() => edit(record)}>
                    Edit
                </Typography.Link>
            ),
        }
    ]
    const expandRecord = (record: any) => {
        return <>
            <p> test: {JSON.stringify(record)}</p>
        </>
    }
    return (
        <>
            <Table<SuffixRow> dataSource={props.data} columns={columns}
                rowKey="id"
                expandable={{
                    expandedRowRender: expandRecord,
                }}>
            </Table>
            <Button onClick={() => setAdding(true)}>add suffix</Button>
            <Modal open={modifying.modifying} onCancel={() => setModifying({ modifying: false, data: null })}
                footer={[]}>
                <ModifySuffix data={modifying.data} onSubmit={suffixModified}></ModifySuffix>
            </Modal>
            <Modal open={adding} onCancel={() => setAdding(false)}
                footer={[]}>
                <AddSuffix onSubmit={suffixAdded}></AddSuffix>
            </Modal>
        </>
    )
}

interface ManageSuffixProps {

}

export default function ManageSuffix(props: ManageSuffixProps) {
    // const currentList = useQuery(API.PREFIX_LIST)
    const currentList: SuffixRow[] = [
        {
            id: 1,
            defaultSpell: "ion",
            spells: [],
            meanings: ["行为结果"],
            partOfSpeech: [{
                type: 1, // noun
            },],
        },
    ]
    const onModify = (idx: number, data: any) => {
        console.log("idx: ", idx)
        console.log("data: ", data)
    }
    return (
        <SuffixTable data={currentList} onModify={onModify}></SuffixTable>

    )
}