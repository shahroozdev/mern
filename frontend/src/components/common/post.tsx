import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PostProps } from "../../types/interfaces";
import {
  useFetchData,
  useFetchedData,
  useMutate,
} from "../../hooks/customHooks";
import LoadingSpinner from "./loadingSpiner";

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const [text, setComment] = useState("");
  const user: any = useFetchedData("profile");
  const { mutate, isPending: isDeleting } = useMutate({
    url: `/posts/${post?._id}`,
    qKey: "posts",
    method: "DELETE",
  });
  const { mutate:postComment, isPending: isCommenting } = useMutate({
    url: `/posts/comment/${post?._id}`,
    qKey: "posts",
  });
  const { fetchData, isLoading: isLiking } = useFetchData();
  const postOwner = post.user;

  const isLiked = post?.likes?.includes(user?._id);
  const isMyPost = user?._id === post?.user?._id;

  const formattedDate = "1h";

  const handleDeletePost = async () => {
    await mutate({});
  };

  const handlePostComment = async(e: any) => {
    e.preventDefault();
	await postComment({text})
	setComment("")
  };

  const updateLikesList =(oldData, result)=>{
	return oldData.map(p=> {
		if(p._id === post?._id){
		return {...p, likes:result?.updatedLikes}
		}else {return p}
		});
  }
  const handleLikePost = async () => {
    await fetchData({
      url: `/posts/like/${post?._id}`,
      qKey: "posts",
      method: "GET",
	  updateCache:updateLikesList
    });
  };

  const handleOpenModal = () => {
    const modal = document.getElementById(
      `comments_modal${post._id}`
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal(); // Safely call showModal
    }
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImage || "/avatars/boy1.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost &&
              (isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="flex justify-end flex-1">
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                </span>
              ))}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={handleOpenModal}
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post?.comments?.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment?.user?.profileImage ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={text}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4" type={"submit"}>
                      {isCommenting ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              {isLiking ?<LoadingSpinner size="sm"/>:<div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                <FaRegHeart
                  className={`w-4 h-4 cursor-pointer ${
                    isLiked
                      ? "text-pink-500"
                      : "text-slate-500 group-hover:text-pink-500"
                  }`}
                />

                <span
                  className={`text-sm  group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  }`}
                >
                  {post?.likes?.length}
                </span>
              </div>}
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
