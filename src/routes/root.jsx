import { useEffect } from "react";
// 使用 Outlet 来在 layout 中标识子路由在哪里渲染
// 使用 Link 来进行路由的切换
// 将 Link 更换为 NavLink 来实现根据实际路由进行不同的样式展示
// useNavigation 钩子会返回当前 navigation 的所有信息，
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
// import { useEffect } from "react";
import { getContacts, createContact } from "../contacts";

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {

    // ******有关错误页面******

    // 注意，errorElement 只能捕获一部分错误，并不是全部的错误
    // 主要处理这几种情况：
    // 1. React Router 所提供的功能中抛出的错误，代表就是 loaders 和 actions
    // 2. 路由不匹配的情况，如这个页面中 href 跳转的两个不存在的路由
    //    <a href={`${不存在的路由地址}`}>Your Name</a>
    // 3. 渲染过程中出现的错误，如下面的代码。通过点击抛出的错误并不能被捕获，
    //    但是直接在 render 内容中抛出错误的话会被捕捉

    // 不会触发 errorElement
    // <div style={{ cursor: "pointer" }} onClick={functionError}>My test</div>
    // const functionError = () => {
    //     throw new Error('自定义错误')
    // }

    // 会触发 errorElement
    // throw new Error('自定义错误')

    // ******有关 URL 刷新******

    // 不刷新页面改变当前路由的 api
    // const functionTestRouterChange = () => {
    //     history.pushState({ page: 1 }, '', '/1233');
    //     history.replaceState({ page: 1 }, '', '/1233')
    // }

    // 可以在 back 或者 go 的时候看到填写的 state 内容，但是上面两个方法并不能触发事件
    // 当然，history 的 back 和 go 方法也不会触发 document 的重新加载，但是可以触发 popstate 事件
    // useEffect(() => {
    //     window.addEventListener('popstate', () => {
    //         console.log(history.state)
    //     }, false);
    // }, [])

    // 关于其他有关路由变化的链接
    // https://developer.mozilla.org/zh-CN/docs/Web/API/History_API
    // https://juejin.cn/post/6844903682828402701

    // 关于 href 的使用
    // 传统的切换 URL 的方法：<a href={`contacts/1`}>Your Name</a> 
    // 但是这样使用 href 进行路由跳转方式是及其容易出错的，会导致 contacts 的叠加。
    // 具体情况为，连续点击这两个连接后，路由会变成 contacts/contacts/id。
    // 主要原因是因为，当我们使用 href 的时，如果填写的 URL 并不完整，
    // 会被 href 当做相对路径来处理，当我们填写的内容是 contacts/1 的时候，
    // 会被理解为当前目录中的 contacts/1，具体来说，当前访问的页面文件为 /contacts/1，
    // herf  = contacts/1 时会被理解为，加载当前目录下的 contacts 文件夹中的文件 1，
    // 由于当前目录地址为 /contacts，那么 URL 就会解析并访问路由 /contacts/contacts/1。
    // 有三种改法，一种是使用完全的 URL 地址，另一种是使用正确的相对地址 /contacts/1。
    // 虽然按照上面的做法，能解决 herf 地址不对的问题，但是还有一个问题无法解决。
    // 那就是 href 后页面会重新加载的问题，每次使用 href 修改页面路由都会导致
    // 页面的重新刷新和加载全部文档内容。这样体验非常差，同时这样的操作逻辑并不符合
    // 路由的观念，依旧是重新加载文档，打开网页。

    // 最后一直就是要介绍的，使用 React Router 的写法，
    // 切换为 React Router 的 Link 标签去跳转到子路由。
    // Link 不但能解决上面的 URL 跳转错误的问题，还不会让页面重新加载。
    // <Link to={`contacts/1`}>Your Name</Link>

    // 先不提 React Router 是如何解决这个问题的，首先想想我们有什么方法去处理上面的问题
    // 为了解决这个问题，要利用的就是 History API，pushState 方法可以改变页面的路由，同时也不会触发
    // 浏览器去加载或者检查 URL 上的文件，这一特性非常适合 SPA。
    // history.pushState('state', '', '123') 会修改页面参数最后一个地址为 123。
    // 同样，replaceState 方法也有同样的效果，只不过这个方法会从 history 中删除跳转前的链接。
    // 现在我们已经可以改变路由了，那么怎么监听呢？首先可以看到的是文档中提到的 popstate 事件监听。
    // 但是经过查看文档和实验才发现， popstate 事件只能在页面前进和后退的时候才能被触发，
    // 也就是浏览器的前进后退事件和 history API 的 go 和 back 方法，pushState 和 replaceState 并不能触发。
    // 所以需要自己去添加 onload 事件的监听和对路由切换时的处理。

    // ******有关数据加载******
    const { contacts, q } = useLoaderData();

    const navigation = useNavigation();
    const submit = useSubmit();

    // 对于搜索后，点击返回路由变化但是不触发 input 组件内容变化的解决
    // 因为给 input 设置 defaultValue 只是在刷新页面的时候控制 input 的内容显示，
    // 而 input 组件并没有和变量 q 使用 state 进行绑定
    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    // 数据、路由和布局的耦合，所以有了 loader 这个功能，
    // 每个路由都可以定义一个 loader 方法来在元素渲染前获取数据。
    // 这个数据可以在 useLoaderData hook 中获取。
    // 同时，这里学到的一个逻辑是，可以把 render 内容和 网络请求内容放到一个文件中， 利用两次导入来实现所需要的数据加载后再显示

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    {/* 注意，默认的方法是 GET 方法，所以获取参数的方式应该从路由的 loader 中获取，而不是 actions */}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                }>
                <Outlet />
            </div>
        </>
    );
}

// 因为 form 的 GET 方法会触发页面导航，这样就可以在 loader 中获取路由的参数了
export async function loader({ request }) {
    // 从路由中获取参数的方法
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}