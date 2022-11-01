import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from "antd";
import API from '../helper/api';
import { post } from '../helper/server/general';
import { Stem } from './stem_modify';


export default function AddStem(props: {
    onSubmit: (data: Stem) => void
}) {
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    const onFinish = (values) => {
        post(API.STEM_ADD, undefined, values)
            .then((r) => {
                console.log("Got result: ", r)
                props.onSubmit(values)
            })
            .catch((e) => {
                console.error("error: ", e)
            })
        console.log("finished: ", values)
    }
    const onFinishFailed = (errInfo) => {
        console.log("error: ", errInfo)
    }
    const onAddSpell = (add) => {
        console.log("onAddSpell: ", add)
        add()
    }
    const initVal = {
        spells: [],
        meanings: [],
    }
    return <>
        <Form
            {...formItemLayoutWithOutLabel}
            onFinish={onFinish} autoComplete="off"
            onFinishFailed={onFinishFailed}
            initialValues={initVal}
        >
            <Form.Item label="主拼写" name="defaultSpell" required={true}><Input /></Form.Item>
            <Form.Item label="起源" name="origin" required={false}><Input /></Form.Item>
            <Form.List name="spells">
                {
                    (spells, { add, remove }, { errors }) => <>
                        {
                            spells.map((spell, index) => {
                                console.log("current spell: ", spell, index)
                                return <Form.Item label={index === 0 ? "spells" : ""}
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    key={spell.key}>
                                    <Form.Item {...spell} validateTrigger={['onChange', 'onBlur']} rules={[
                                        { required: true }
                                    ]}
                                        noStyle>
                                        <Input placeholder='input here' />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(spell.name)}
                                    />
                                </Form.Item>
                            })
                        }
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => onAddSpell(add)}
                                style={{ width: '60%' }}
                                icon={<PlusOutlined />}
                            >
                                Add new spell
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                }
            </Form.List>
            <Form.Item label="meanings">
                <Form.List name="meanings">
                    {
                        (meanings, { add, remove }, { errors }) => <>
                            {
                                meanings.map((meaning, idx) => {
                                    return <Form.Item key={meaning.key}>
                                        <Form.Item {...meaning} validateTrigger={['onChange', 'onBlur']} rules={[
                                            { required: true }
                                        ]}
                                            noStyle>
                                            <Input />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(meaning.name)}
                                        />
                                    </Form.Item>
                                })
                            }
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => onAddSpell(add)}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add new meaning
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    }
                </Form.List>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </>
}