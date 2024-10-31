import CustomForm from "../../components/molecules/form/index.tsx";
import {useFetchedData, useMutate } from "../../hooks/customHooks.tsx";
import { updateProfileForm } from "../../utils/forms/formsArrays.tsx";

const EditProfileModal = () => {
	const {mutate} =useMutate({url:'/users/update', qKey:'profile'})
	const myself = useFetchedData('profile')
	const onSubmit =async(values)=>{
		await mutate(values)
	}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<CustomForm props={{...updateProfileForm, onSubmit,defaultValues:myself}}/>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;