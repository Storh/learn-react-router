import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// 可以获取 url 参数的 loader 函数
export async function loader({ params }) {
    return getContact(params.contactId);
}

export default function Contact() {

    const contact = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        // <Form> 的 action 可以像 <Link to> 一样填写一个相对值
                        // 可以实现向添加了 action 内容的相对地址中提交 form 的情况
                        // 而一旦向一个地址提交请求之后，就会去寻找对应的路由位置，如果找不到的话就会触发404
                        // 所以也就需要给相对地址添加处理内容，给路由添加 action 函数
                        // 同时要注意的是，一定得是Form这个 router 的组件才行，
                        // 它对 form 的默认提交行为进行了拦截，再创建基于路由的post请求拦截
                        // 然后根据 action 匹配的地址去发起请求
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export async function action({ request, params }) {
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

function Favorite({ contact }) {
    // 使用 fetcher 来对 form 进行提交的好处是不会影响路由堆栈
    const fetcher = useFetcher();
    // yes, this is a `let` for later
    let favorite = contact.favorite;

    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}
