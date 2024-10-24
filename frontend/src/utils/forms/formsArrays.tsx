
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md";
import { signInSchema, signUpSchema } from "../../types/schemas";
import XSvg from "../../components/svgs/X";

export const signUpForm ={
    schema:signUpSchema,
    preNode:(<><XSvg className='w-24 lg:hidden fill-white' /><h1 className='text-4xl font-extrabold text-white'>Join today.</h1></>),
    style:'lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col',
    btnText:'Sign Up',
    arr:[
    {
        preNode:(<MdOutlineMail />),
        type:'email',
        placeHolder:'Email',
        inputName:'email',
    },
    {
        style:'flex gap-4 flex-wrap',
        childs:[
            {
                preNode:(<FaUser />),
                type:'text',
                placeHolder:'Username',
                inputName:'username',
                pStyle:'flex-1',
            },
            {
                preNode:(<MdDriveFileRenameOutline />),
                type:'text',
                placeHolder:'Full Name',
                inputName:'fullName',
                pStyle:'flex-1',
            },
        ]
    },
    {
        preNode:(<MdPassword />),
        type:'password',
        placeHolder:'Password',
        inputName:'password',
    },
]}
export const signInForm ={
    schema:signInSchema,
    preNode:(<><XSvg className='w-24 lg:hidden fill-white' /><h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1></>),
    style:'flex gap-4 flex-col',
    btnText:'Login',
    arr:[
    {
        preNode:(<FaUser />),
        type:'text',
        placeHolder:'Username',
        inputName:'username',
    },
    {
        preNode:(<MdPassword />),
        type:'password',
        placeHolder:'Password',
        inputName:'password',
    },
]}