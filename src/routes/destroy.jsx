import { redirect, useNavigate } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
    // 点击删除的时候随机出现错误
    if (Math.floor(Math.random() * 10) % 2)
        throw new Error("oh dang!");
    await deleteContact(params.contactId);
    return redirect("/");
}

const DeleteAgain = () => {
    const navigate = useNavigate()
    const backPage = () => {
        navigate(-1);
    }
    return (
        <button onClick={backPage}>
            返回上一页
        </button>
    )
}

export default DeleteAgain