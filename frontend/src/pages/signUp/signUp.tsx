import { Link } from "react-router-dom";

import XSvg from "../../components/svgs/X.tsx";

import CustomForm from "../../components/molecules/form/index.tsx";
import { signUpForm } from "../../utils/forms/formsArrays.tsx";
import { useMutate } from "../../hooks/customHooks.tsx";


const SignUpPage = () => {
	const {mutate} =useMutate({url:'/auth/signUp', qKey:'signUp', sendTo:'/login'})
	const onSubmit = async(values:any) => {
		await mutate(values)
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<CustomForm props={{...signUpForm, onSubmit}}/>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;