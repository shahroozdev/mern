import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { useToast } from "../components/common/toast"
import { HTTPMETHODS } from "../types/types"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const useFetchData=()=>{
  const { showToast } = useToast();
  const navigate = useNavigate();
  const invalidateFn =useInvalidateQueries()
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading]=useState(false);
  const fetchData= async(values:{url:string, method:HTTPMETHODS,data?:any, sendTo?:string, noToast?:boolean,qKey?:string|string[], updateCache?:any})=>{
    try {
      setIsLoading(true)
    const res = await fetch('/api'+values?.url,{
       method:values?.method||"POST",
       headers:{
           "content-type":"application/json"
       },
       ...(values?.data ? {body:JSON.stringify(values?.data)} : {})
    })
    const result = await res.json();
    if (!res.ok) {
       !values?.noToast&&showToast(result.error, 'error');
       throw new Error(result.error);
     }
     !values?.noToast&&showToast(result.message, 'success');
     values?.sendTo&& navigate(values?.sendTo)
     values?.qKey&&!values?.updateCache&&invalidateFn(values?.qKey)
     values?.updateCache&& queryClient.setQueryData([values?.qKey],(oldData)=>values?.updateCache(oldData, result))
     return result;
  } catch (error) {
       throw error
  }finally{
    setIsLoading(false)
  }
}
return {fetchData, isLoading}
}
export const useMutate = (values:{url:string, qKey:string|string[], method?:HTTPMETHODS, sendTo?:string, isMulti?:Boolean})=>{
    const queryClient = useQueryClient()
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {mutate, isError, isPending, error} =useMutation({
        mutationFn: async(data:any)=>{
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]:[string, any]) => {formData.append(key, value);})
          const body = data&&values.isMulti?formData:JSON.stringify(data)
           try {
             const res = await fetch('/api'+values?.url,{
                method:values?.method||"POST",
                headers:!values?.isMulti ?{
                    "content-type":"application/json"
                  }:undefined,
                body:body
             })
             const result = await res.json();
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

export const useInvalidateQueries =()=>{
    const queryClient = useQueryClient()
    const invalidateFn =async (qKey:string|string[]) => {
      const queryKey = Array.isArray(qKey)?qKey:[qKey]
  return queryKey.map(async (item: string) => {
        return await queryClient.invalidateQueries({queryKey: [item]});
      })

}
return invalidateFn;
}
export const useGetData=(values:{url:string, qKey:string, enabled?:boolean, initialData?:any, noRetry?:boolean})=>{
  const result = useQuery({
    queryKey: [values?.qKey],
    queryFn: async()=>{
      try {
        const res = await fetch('/api'+values?.url,{
           method:"GET",
           headers:{
               "content-type":"application/json"
           },
        })
        const result = await res.json();
        if(result?.error) return null;
        if (!res.ok) {
           throw new Error(result.error);
         }
         return result;
      } catch (error) {
           throw error
      }
   },
    enabled: values?.enabled,
    initialData: values?.initialData ?? null,
    refetchOnWindowFocus: false,
    retry: values?.noRetry?false:true,
  }) as UseQueryResult<any>;

  return result;
}

export const useFetchedData = (key: string) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData([key]);
};