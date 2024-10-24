import { zodResolver } from "@hookform/resolvers/zod";
import {z}  from 'zod'
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../../atoms/input";

const CustomForm = ({ props }:{props: any}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof props.schema>>({
    resolver: zodResolver(props.schema),
    // defaultValues: props?.defaultVaules||{}  // Use Zod schema as resolver for validation
  });
  const onSubmit:SubmitHandler<any> = (values: any) => {
    console.log(values)
    props.onSubmit(values); // Ensure onSubmit from props is used
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}  className={`${props?.style||''}`}>
        {props?.preNode}
      {props?.arr?.map((item:any, idx:number) =>
        (<div key={idx} className="w-full">
        {item?.childs? <div className={item?.style}>{item?.childs?.map((ele, index)=>(
            <CustomInput props={{item:ele , register, errors}} key={index}/>
        ))}</div>:
        <CustomInput props={{item , register, errors}}/>
        }
      </div>)
      )}
      {props?.postNode}
      <button className={props.btnCss??'submit-btn'} type='submit'>{props.btnText}</button>
    </form>
  );
};

export default CustomForm;
