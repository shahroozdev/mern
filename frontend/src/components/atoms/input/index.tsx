import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ReactNode, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type item = {
  type: string; // Specify allowed types
  inputName: string; // Name of the input field
  placeHolder?: string; // Placeholder text
  postNode?:ReactNode;
  preNode?:ReactNode;
  style?:string;
  pStyle?:string;
};
interface CustomInputProps {
  item: item;
  errors: FieldErrors<any>; // Errors object from react-hook-form
  register: UseFormRegister<any>; // Register function from react-hook-form
}
const CustomInput = ({ props }: { props: CustomInputProps }) => {
  const [showPassword, setshowPassword] = useState<boolean>(false);
  return (<>
    <label className={`input input-bordered rounded flex items-center gap-2 ${props.item.pStyle||''}`} htmlFor={props.item.inputName}>
    {props.item?.preNode && props.item?.preNode}
      {props.item.type === "password" ? (
        <div
          className={`flex items-center grow`}
        >
          <input
            type={showPassword ? "text" : "password"}
            id={props.item.inputName}
            {...props.register(props.item.inputName)}
            placeholder={props?.item?.placeHolder}
            className={`grow ${props?.item?.style}`}
          />
          <div onClick={() => setshowPassword(!showPassword)}>
          {!showPassword ?<FaEye /> :<FaEyeSlash />}
          </div>
        </div>
      ) : props.item.type === "checkbox" ? (
        <div className="w-full flex justify-start">
        <input
          type={props.item.type}
          id={props.item.inputName}
          {...props.register(props.item.inputName)}
          className={`grow`}
        />
        {props.item.postNode}
        </div>
      ) : (
        <input
          type={props.item.type}
          id={props.item.inputName}
          {...props.register(props.item.inputName)}
          placeholder={props.item.placeHolder}
          className={`grow`}
        />
      )}
      {props.item?.postNode && props.item?.postNode}
    </label>
    {props.errors[props.item?.inputName] && (
            <p className="text-red-500 text-sm">{String(props.errors[props.item.inputName]?.message)}</p>
          )}
    </>
  );
};

export default CustomInput;
