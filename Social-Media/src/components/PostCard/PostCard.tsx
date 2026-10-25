import {
  ChevronDown,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import type { PostCardI, TopComment } from "../../Types/postCard.types";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getPostComments } from "../../services/comments.service";
import moment from "moment";
import PostComment from "./PostComment";
import { deletePost, updatePost } from "../../services/post.service";
import { getCurrentUserId } from "../../utils/currentUser";
import toast from "react-hot-toast";

export default function PostCard({ post }: { post: PostCardI }) {
  const [allComments, setAllComments] = useState<TopComment[] | []>([]);
  const [visibleComments, setVisibleComments] = useState(2);
  async function getComments(postId: string) {
      try {
        const { data } = await getPostComments(postId);
        setAllComments(data.data.comments);
      } catch (error) {
        console.log(error);
      }
  }
  useEffect(() => {
    
    getComments(post._id);
  }, [post.id]);
  function handleMoreComments() {
    setVisibleComments(visibleComments + 2);
  }
  const isOwner = Boolean(getCurrentUserId() && getCurrentUserId() === post.user?._id);
  async function editPost() {
    const body = window.prompt("Edit your post", post.body);
    if (body === null || !body.trim() || body.trim() === post.body) return;
    const form = new FormData(); form.append("body", body.trim());
    try { const { data } = await updatePost(post._id, form); toast.success(data.message || "Post updated"); window.location.reload(); }
    catch (error: any) { toast.error(error?.response?.data?.message || "Could not update post"); }
  }
  async function removePost() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try { const { data } = await deletePost(post._id); toast.success(data.message || "Post deleted"); window.location.reload(); }
    catch (error: any) { toast.error(error?.response?.data?.message || "Could not delete post"); }
  }
  return (
    <article className="mx-auto my-3 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Post creator, timestamp, and privacy */}
      <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
            src={post.user.photo}
            alt={post.user.name}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="truncate text-sm font-semibold text-gray-900">
                {post.user.name}
              </span>
              <span className="truncate text-xs text-gray-500">
                {post.user.username}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
              <span>{moment(post.createdAt).fromNow()}</span>
              <span aria-hidden="true">·</span>
              {/* <PrivacyIcon  size={13} /> */}
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>
        {isOwner ? <div className="flex items-center gap-1"><button type="button" onClick={editPost} className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">Edit</button><button type="button" onClick={removePost} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button></div> : <button aria-label="More post options" className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800" type="button"><MoreHorizontal size={21} /></button>}
      </header>

      {/* Post body */}
      <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
        <p>{post.body}</p>
      </div>

      {/* Post image */}

      {post.image && (
        <>
          <img
            className="block max-h-[520px] w-full bg-gray-100 object-cover"
            src={post.image}
            alt={post.body}
          />
        </>
      )}

      {/* Reaction and comment counts */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart aria-hidden="true" fill="currentColor" size={11} />
          </span>
          <span>{post.likesCount} likes</span>
        </div>
        <div className="flex gap-3">
          <span>{post.commentsCount} comments</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Like, comment, and share actions */}
      <div className="mx-4 flex items-center border-y border-gray-200 sm:mx-5">
        <button
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium transition hover:bg-gray-50  text-gray-600`}
          type="button"
        >
          <Heart fill={"currentColor"} size={18} />
          Like
        </button>
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          onClick={() => document.getElementById("post-comment")?.focus()}
          type="button"
        >
          <MessageCircle size={18} />
          Comment
        </button>
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          type="button"
        >
          <Share2 size={18} />
          Share
        </button>

        <Link to={`/postDetails/${post._id}`}>View Details</Link>
      </div>

      {/* Comments, with the first comment shown by default */}
      <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
        <button
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
          type="button"
          onClick={handleMoreComments}
        >
          Show more comments
          <ChevronDown className={`transition-transform"}`} size={16} />
        </button>

        {/* Comments */}
        {allComments.length > 0
          ? allComments.slice(0, visibleComments).map((comment) => (
              <div className="my-3 space-y-3" key={comment._id}>
                <div className="flex items-start gap-2.5">
                  <img
                    alt={comment.commentCreator.name}
                    className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                    src={comment.commentCreator.photo}
                  />
                  <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="text-xs font-semibold text-gray-900">
                        {comment.commentCreator.name}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {comment.commentCreator.username}
                      </span>
                    </div>
                    <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                      {comment.content}
                    </p>
                    {comment.image && <>
                    <img src={comment.image} className="w-20 h-20" alt="" />
                    </>}
                    <span className="mt-1 block text-[11px] text-gray-500">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : post.topComment && (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <img
                    alt={post.topComment.commentCreator.name}
                    className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                    src={post.topComment.commentCreator.photo}
                  />
                  <div className="min-w-0 rounded-2xl bg-gray-100 px-3 py-2">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="text-xs font-semibold text-gray-900">
                        {post.topComment.commentCreator.name}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {post.topComment.commentCreator.username}
                      </span>
                    </div>
                    <p className="mt-0.5 break-words text-sm leading-5 text-gray-800">
                      {post.topComment.content}
                    </p>
                    {post.topComment.image && <>
                    <img src={post.topComment.image} className="w-20 h-20" alt="" />
                    </>}
                    <span className="mt-1 block text-[11px] text-gray-500">
                      {moment(post.topComment.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            )}
        {/* Add a comment */}
        <PostComment postId={post._id} getComments={getComments} />
      </section>
    </article>
  );
}
