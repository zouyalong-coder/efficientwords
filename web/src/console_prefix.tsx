import { Input, Form, Layout, Button } from "antd"

type Store = {
    [x: string]: any;
};

// components.
function SearchPrefixPanel(props: any) {
    const onFinish = (values: any) => {
        console.log("Form finished...", values)
    };

    return (
        <div {...props}>
            <Layout>
                <Layout>
                    <Form initialValues={{remember: true}} onFinish={onFinish}>
                        <Form.Item
                            name="keyword"
                            rules={[{required: true, message: 'pls input the keyword'}]}
                            >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>
                </Layout>
            </Layout>
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