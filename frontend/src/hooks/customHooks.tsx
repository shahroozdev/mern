import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../components/common/toast"
import { HTTPMETHODS } from "../types/types"
import { useNavigate } from "react-router-dom"

export const useMutate = (values:{url:string, qKey:string, method?:HTTPMETHODS, sendTo?:string;})=>{
    const queryClient = useQueryClient()
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {mutate, isError, isPending, error} =useMutation({
        mutationFn: async(data:any)=>{
           try {
             const res = await fetch('/api'+values?.url,{
                method:values?.method||"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify(data)
             })
             const result = await res.json();
             console.log(res ,result?.error)
             if (!res.ok) {
                showToast(result.error, 'error');
                throw new Error(result.error);
              }
              showToast(result.message, 'success');
              values?.sendTo&& navigate(values?.sendTo)
              return result;
           } catch (error) {
                throw error
           }
        },
        onSuccess:async () => {
                const queryKey = Array.isArray(values.qKey)?values.qKey:[values?.qKey]
            return queryKey.map(async (item: string) => {
                  return await queryClient.invalidateQueries({queryKey: [item]});
                })

          },
    })


    return {mutate, isError, isPending, error}

}