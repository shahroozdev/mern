import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ChangeEvent, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useFetchedData, useMutate } from "../../hooks/customHooks";

const CreatePost = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState(null);
  const user: any = useFetchedData("profile");
  const { mutate, isPending, isError } = useMutate({
    url: "/posts/create",
    qKey: "posts",
  });

  const imgRef = useRef<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
	console.log(text, img)
    if (text) {
      await mutate({ text, img });
      setText("");
      setImg(null);
    }
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target && e.target.files && e.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImg(reader.result.toString()); // Save base64 string in state
        }
		reader.onerror = (error) => {
			console.error("Error reading file:", error);
		  };
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(img);
  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={user?.profileImage || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            type="submit"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
