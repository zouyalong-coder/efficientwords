import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { ConfigProvider, Layout, Menu, MenuProps } from 'antd'
import 'antd/dist/antd.css'
import {default as PrefixPage} from "./console_prefix"

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
    <div>
      <ConfigProvider>
        <Layout>
          <Header>
            <Menu items={items} mode="horizontal" onClick={onClick} selectedKeys={[current]}></Menu>
          </Header>
          <Layout>
            {currentPage(current)}
          </Layout>
        </Layout>
        {/* <div className="App"> */}
          {/* <Menu items={items} /> */}
          {/* <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p> */}
        {/* </div> */}
      </ConfigProvider>
    </div>

  )
}

export default App
