import { ImagePlus, Send, X } from "lucide-react";
import { useState } from "react";
import { createComment } from "../../services/comments.service";
import { toast } from "@heroui/react";
function PostComment({postId, getComments}:{postId:string , getComments: (postId : string)=> void}) {
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fromData = new FormData();
    function handleImage(e : React.ChangeEvent<HTMLInputElement>){
        // console.log(e.target.files[0]);
        const file = e.target.files?.[0];
        if(file){
            setImage(file)
           setImagePreview(URL.createObjectURL(file))
        }
    }
    function clearPreview(){
        setImagePreview(null)
    }
    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        fromData.append("content", content);
        if(image){
            fromData.append("image", image);
        }
        try {
            console.log(postId);
            const {data} = await createComment(postId, fromData);
            toast.success(data.message)
            console.log(data);
            getComments(postId)
            setContent("")
            setImage(null);
            setImagePreview(null)
        }catch (error) {
            console.log(error);
        }
    }
  return (
    <form className="mt-4 flex flex-col gap-2 pb-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2.5">
        <img
          alt="Your profile"
          className="size-8 shrink-0 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
        />
        <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
          <span className="sr-only">Write a comment</span>
          <input
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
            id="post-details-comment"
            placeholder="Write a comment..."
            value={content}
            onChange={(e)=>setContent(e.target.value)}
          />
          <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
            <span className="sr-only">Add an image</span>
            <input
              accept="image/*"
              className="sr-only"
              type="file"
             onChange={handleImage}
            />
            <ImagePlus size={16} />
          </label>
          <button
            aria-label="Post comment"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
            type="submit"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      {imagePreview && <>
        <div className="w-50 h-50 relative">
        <X onClick={clearPreview} className="absolute top-0 right-0 cursor-pointer"/>
        <img src={imagePreview} alt="" className="w-50 h-50 object-cover"/>
        </div>
      </>}
    </form>
  );
}

export default PostComment;
