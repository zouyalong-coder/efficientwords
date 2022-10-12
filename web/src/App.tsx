import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { ConfigProvider, Layout, Menu, MenuProps } from 'antd'
import 'antd/dist/antd.css'
import {default as PrefixPage} from "./components/console_prefix"
import { SessionContext } from './session_ctx'

const {Header, Sider, Content} = Layout;

function App() {
  const [current, setCurrent] = useState("prefix")

  const items = [
    { label: "管理端", key: "console",
      children: [
        { label: "前缀", key: "prefix" },
        { label: "后缀", key: "suffix" },
        { label: "词根", key: "stem" },
      ]
    },
    {
      label: "用户端", 
      key: "user"
    }
  ];

  const onClick: MenuProps["onClick"] = e => {
    console.log("click: ", e);
    setCurrent(e.key);
  }

  const currentPage = function(cur: string) {
    if (cur === "prefix") {
      return (
        <PrefixPage></PrefixPage>
      )
    } else {
      return (
        <div>Default</div>
      )
    }
  };

  return (
    <SessionContext.Provider value={{}}>
      <ConfigProvider>
        <Layout>
          <Header>
            <Menu items={items} mode="horizontal" onClick={onClick} selectedKeys={[current]}></Menu>
          </Header>
          <Layout>
            {currentPage(current)}
          </Layout>
        </Layout>
      </ConfigProvider>
    </SessionContext.Provider>

  )
}

export default App
