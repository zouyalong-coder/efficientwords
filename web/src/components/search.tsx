import { Col, Form, Input, Row, Button } from "antd";


interface ISearchPanelProps {
    onSearch: (keyword: string) => boolean,
    width?: number,
}

function SearchPanel(props: ISearchPanelProps) {
    const [form] = Form.useForm();
    const onFinish = (values: {keyword: string}) => {
        const clearForm = props.onSearch(values.keyword) || false;
        clearForm && form.resetFields();
    }

    return (
        <div>
            <div> current width: {props.width} </div>
            <Form form={form} initialValues={{remember: true}} onFinish={onFinish}>
                <Row>
                    <Col span={5}></Col>
                    <Col span={10}>
                        <Form.Item
                            name="keyword"
                            rules={[{required: true, message: 'pls input the keyword'}]}
                            >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item> 
                    </Col>
                    <Col span={4}></Col>
                </Row>
            </Form>
        </div>
    )
}

SearchPanel.defaultProps = {
    width: 10
}


export default SearchPanel;