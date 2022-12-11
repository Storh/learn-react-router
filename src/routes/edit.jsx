import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
    const formData = await request.formData();
    // Object.fromEntries() 是可以把键值对转换为对象。包括 Map Array
    // Object.fromEntries() 接受的参数是实现了可迭代协议的可迭代对象，而 Map 和 Array 就是其中的典型
    // 而 formData 对象本身就实现了可迭代的方法，不需要去调用 formData 对象的 entries() 方法
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol

    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {

    // ?? 空值合并运算符。当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
    const contact = useLoaderData() ?? {};

    // useNavigate 是一个路由的钩子，主要适合在页面中使用，如果是在 action 和 loader中，
    // 使用 redirect 来直接前往某个路由更加合适。
    // 除了这个利用 history 堆栈，传递 -1 来实现后退的方法，
    // 还有直接填入新的路由地址的使用方法，此时填入的是 To 值，实现类似于 <Link to> 的效果。
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                    name="last"
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    type="text"
                    name="twitter"
                    placeholder="@jack"
                    defaultValue={contact.twitter}
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    name="notes"
                    defaultValue={contact.notes}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => {
                    navigate(-1);
                }}>Cancel</button>
            </p>
        </Form>
    );
}