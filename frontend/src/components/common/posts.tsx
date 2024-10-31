import PostSkeleton from "../skeleton/postSkeleton.tsx";
import React, { useEffect } from "react";
import {PostProps } from "../../types/interfaces.ts";
import Post from "./post.tsx";
import { useGetData } from "../../hooks/customHooks.tsx";
import { useParams } from "react-router-dom";

const Posts: React.FC<{type:string}> = ({type}) => {
	const {data, isLoading, refetch, isRefetching} = useGetData({url:`/posts/${type}`, qKey:'posts'})
	const params = useParams()
	useEffect(()=>{refetch()},[type, params])

	return (
		<>
			{(isLoading||isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && data && (
				<div>
					{data?.map((post:PostProps) => (
							<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;