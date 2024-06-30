import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import imagePlaceholder from '../../assets/avatar-placeholder.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);


	const {data:authUser} = useQuery({queryKey:["authUser"]})
	const queryClient = useQueryClient();

    const {mutate:CreatePost,isPending,isError} = useMutation({
		mutationFn:async({text,img})=>{
			try{
				const formData = new FormData()
				formData.append("text",text);
				if(img){
					formData.append("img",img);
				}
				console.log(img,text)
				const res = await fetch(`${API_BASE_URL}/api/v2/post/create`,{
					method:"POST",
					credentials:"include",
					body:formData
				})
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.message || "Something went wrong")
				}
               return data
			}catch(error){
				throw new Error(error)
			}
		},
		onSuccess:()=>{
			setText("")
			setImg(null)
			toast.success("Post Created Successfully!")
			queryClient.invalidateQueries({queryKey:["Posts"]})
		}
	})

	const imgRef = useRef(null);



	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImg(file)
			// const reader = new FileReader();
			// reader.onload = () => {
			// 	setImg(reader.result);
			// };
			// reader.readAsDataURL(file);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(img)
		CreatePost({text,img})
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || imagePlaceholder} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file'
                    accept="image/*"
                     hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>Something went wrong</div>}
			</form>
		</div>
	);
};
export default CreatePost;