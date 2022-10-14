import { Button, Form, Input, Row } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface IPrefixProps {

}

export default function AddPrefix(props: IPrefixProps) {
    const [form] = Form.useForm();
    const onFinish = (
        value: { 
            literal: string,
            origin: string,
        }
    ) => {

    }
    return (
        <Form form={form} labelCol={{span: 8}} wrapperCol={{span: 16}}
            onFinish={onFinish}>
                <Form.Item
                    name="literal"
                    label="前缀"
                    rules={[{ required: true, message: 'pls input the prefix' }]}
                    >
                        <Input />
                    </Form.Item>
                <Form.Item
                    name="origin"
                    label="起源"
                    >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="stem">
                    
                </Form.Item>
                <Form.List
                    name="meanings"
                    rules={[
                        {
                            validator: async (_, meanings) => {
                                if (!meanings || meanings < 1) {
                                    return Promise.reject(new Error("At least 1 meaning must be given"))
                                }
                            }
                        }
                    ]}>
                    {
                        (fields, {add, remove}, {errors}) => (
                            <>
                                {
                                    fields.map((field, index) => (
                                        <Form.Item
                                            label={"meaning " + (index +1) }
                                            required={true}
                                            key={field.key}
                                            >
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: 'meanrequired'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="meaning" style={{ width: '60%' }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
                                        </Form.Item>
                                    ))
                                }
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '60%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add field
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )
                    }
                    
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">添加</Button>
                </Form.Item>
        </Form>
    )
}