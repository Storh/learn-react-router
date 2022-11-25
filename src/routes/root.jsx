export default function Root() {

    // 注意，errorElement 只能捕获一部分错误，并不是全部的错误
    // 主要处理这几种情况：
    // 1. React Router 所提供的功能中抛出的错误，代表就是 loaders 和 actions
    // 2. 路由不匹配的情况，如这个页面中 href 跳转的两个不存在的路由
    // 3. 渲染过程中出现的错误，如下面的代码。通过点击抛出的错误并不能被捕获，
    //    但是直接在 render 内容中抛出错误的话会被捕捉

    // 不会触发 errorElement
    const functionError = () => {
        throw new Error('自定义错误')
    }

    // 会触发 errorElement
    // throw new Error('自定义错误')

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href={`contacts/1`}>Your Name</a>
                        </li>
                        <li>
                            <a href={`contacts/2`}>Your Friend</a>
                        </li>
                        <li>
                            <div style={{ cursor: "pointer" }} onClick={functionError}>My test</div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail"></div>
        </>
    );
}