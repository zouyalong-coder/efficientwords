import { Button, Modal, Table, Tag, Typography } from "antd";
import { useState } from "react";
import AddStem from "./stem_add";
import ModifyStem from "./stem_modify";

interface PartOfSpeech {
    type: number,
    desc?: string,
}

interface StemRow {
    id: number,
    defaultSpell: string,
    spells?: string[],
    meanings: string[],
    partOfSpeech?: PartOfSpeech[],
}

const StemTable = (props: { data: StemRow[], onModify?: (idx: number, newData: any) => void }) => {
    const [modifying, setModifying] = useState({
        modifying: false,
        data: null,
    })
    const [adding, setAdding] = useState(
        false
    )
    const stemModified = (newData) => {
        console.log("modified: ", newData)
        const idx = props.data.findIndex((val: StemRow, index: number) => {
            console.log("current: ", index, val)
            if (val.id === newData.id) {
                return true;
            }
            return false
        })
        props.onModify && props.onModify(idx, newData)
    }
    const stemAdded = (newData) => {
        console.log("added: ", newData)
    }
    const edit = (record: StemRow) => {
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
            render: (_: any, record: StemRow) => (
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
            <Table<StemRow> dataSource={props.data} columns={columns}
                rowKey="id"
                expandable={{
                    expandedRowRender: expandRecord,
                }}>
            </Table>
            <Button onClick={() => setAdding(true)}>add stem</Button>
            <Modal open={modifying.modifying} onCancel={() => setModifying({ modifying: false, data: null })}
                footer={[]}>
                <ModifyStem data={modifying.data} onSubmit={stemModified}></ModifyStem>
            </Modal>
            <Modal open={adding} onCancel={() => setAdding(false)}
                footer={[]}>
                <AddStem onSubmit={stemAdded}></AddStem>
            </Modal>
        </>
    )
}

interface ManageStemProps {

}

export default function ManageStem(props: ManageStemProps) {
    // const currentList = useQuery(API.PREFIX_LIST)
    const currentList: StemRow[] = [
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
        <StemTable data={currentList} onModify={onModify}></StemTable>
    )
}