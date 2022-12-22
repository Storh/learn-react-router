import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import Index from "./routes/index";
import ErrorPage from "./error-page";
import Contact, { loader as contactLoader, action as contactAction } from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import DeleteAgain, { action as destroyAction } from "./routes/destroy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    // loader 是一个在渲染元素之前执行的加载函数
    loader: rootLoader,
    // action 是一个响应 Form 组件的函数，会响应当前 path 下除了 get 方法的 http 请求
    action: rootAction,
    // 如果我们想使用某个固定的页面布局，需要将内容以 children 的方式来配置
    children: [
      {
        // 提升子路由的错误页面来优化错误展示，只要子路由页面有错误就会保留根路由 UI
        errorElement: <ErrorPage />,
        children: [
          // 添加当前路由没有进入子路由，处于父路由的时候，布局的 Outlet 应该显示什么内容，也就是设置一个首页的含义
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            // 如果一个路由有自己的 报错页面，那么就不会去寻找根路由的错误页面
            errorElement: <DeleteAgain />,
          },
        ]
      }
    ],
  },
  // 这种方法添加的路由并不会套用 Root，而是一个新的页面
  // {
  //   path: "contacts/:contactId",
  //   element: <Contact />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);