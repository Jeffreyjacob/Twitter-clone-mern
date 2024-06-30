import {useMutation,useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useFollow = ()=>{
    const queryClient = useQueryClient();
    const {mutate:follow,isPending} = useMutation({
        mutationFn:async(userId)=>{
           try{
            const res = await fetch(`${API_BASE_URL}/api/v2/user/follow/${userId}`,{
                method:"POST",
                credentials:"include"
              })
              const data = res.json()
              if(!res.ok){
                throw new Error(data.message || "something went wrong")
              }
           }catch(error){
             throw new Error(error)
           }
        },
        onSuccess:()=>{
          Promise.all([
            queryClient.invalidateQueries({queryKey:["suggestedUsers"]}),
            queryClient.invalidateQueries({queryKey:["authUser"]})
          ])
        },
        onError:(error)=>{
          toast.error(error.message)
        }
    })
    return {follow,isPending}
}

export default useFollow;