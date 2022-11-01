import { Button, Modal, Table, Tag, Typography } from "antd";
import { useState } from "react";
import AddWord from "./word_add";
import ModifyWord from "./word_modify";

interface PartOfSpeech {
    type: number,
    desc?: string,
}

interface WordRow {
    id: number,
    defaultSpell: string,
    spells?: string[],
    meanings: string[],
    partOfSpeech?: PartOfSpeech[],
}

const WordTable = (props: { data: WordRow[], onModify?: (idx: number, newData: any) => void }) => {
    const [modifying, setModifying] = useState({
        modifying: false,
        data: null,
    })
    const [adding, setAdding] = useState(
        false
    )
    const wordModified = (newData) => {
        console.log("modified: ", newData)
        const idx = props.data.findIndex((val: WordRow, index: number) => {
            console.log("current: ", index, val)
            if (val.id === newData.id) {
                return true;
            }
            return false
        })
        props.onModify && props.onModify(idx, newData)
    }
    const wordAdded = (newData) => {
        console.log("added: ", newData)
    }
    const edit = (record: WordRow) => {
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
            render: (_: any, record: WordRow) => (
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
            <Table<WordRow> dataSource={props.data} columns={columns}
                rowKey="id"
                expandable={{
                    expandedRowRender: expandRecord,
                }}>
            </Table>
            <Button onClick={() => setAdding(true)}>add word</Button>
            <Modal open={modifying.modifying} onCancel={() => setModifying({ modifying: false, data: null })}
                footer={[]}>
                <ModifyWord data={modifying.data} onSubmit={wordModified}></ModifyWord>
            </Modal>
            <Modal open={adding} onCancel={() => setAdding(false)}
                footer={[]}>
                <AddWord onSubmit={wordAdded}></AddWord>
            </Modal>
        </>
    )
}

interface ManageWordProps {

}

export default function ManageWord(props: ManageWordProps) {
    // const currentList = useQuery(API.PREFIX_LIST)
    const currentList: WordRow[] = [
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
        <WordTable data={currentList} onModify={onModify}></WordTable>
    )
}