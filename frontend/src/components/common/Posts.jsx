/* eslint-disable react/prop-types */
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Posts = ({feedType,username,userId}) => {

	const getPostEndpoint = ()=>{
		switch(feedType){
		case "forYou":
			return `${API_BASE_URL}/api/v2/post`;
		case "following":
			return `${API_BASE_URL}/api/v2/post/getFollowingPost`;
		case "posts":
			return `${API_BASE_URL}/api/v2/post/getUserPost/${username}`
		case "likes":
			return `${API_BASE_URL}/api/v2/post/getLikedPost/${userId}`
		default:
			return `${API_BASE_URL}/api/v2/post`
		}
	}

	const POST_ENDPOINT = getPostEndpoint()

	const {data:getPost,isLoading,refetch,isRefetching} = useQuery({
		queryKey:["Posts"],
		queryFn:async()=>{
			const res = await fetch(POST_ENDPOINT,{
				credentials:"include"
			});
			const data = await res.json();
			if(!res.ok){
				throw new Error(data.error || "something went wrong")
			}
			return data
		}
	})
	useEffect(()=>{
		refetch();
	},[feedType,refetch])
	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && getPost?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && getPost && (
				<div>
					{getPost.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;