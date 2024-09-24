import PostSkeleton from "../skeleton/postSkeleton.tsx";
import { POSTS } from "../../utils/db/dummy.ts";
import React from "react";
import {PostProps } from "../../types/interfaces.ts";
import Post from "./post.tsx";

const Posts: React.FC = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post:PostProps) => (
							<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;