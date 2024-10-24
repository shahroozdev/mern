import {  FC,} from "react";
import { Link } from "react-router-dom";


import XSvg from "../../components/svgs/X.tsx";
import { signInForm } from "../../utils/forms/formsArrays.tsx";
import CustomForm from "../../components/molecules/form/index.tsx";
import { useMutate } from "../../hooks/customHooks.tsx";

const LoginPage : FC = () => {
	const {mutate} =useMutate({url:'/auth/logIn', qKey:'signIn', sendTo:'/'})
	const onSubmit = async(values:any) => {
		await mutate(values)
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
			<CustomForm props={{...signInForm, onSubmit}}/>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;