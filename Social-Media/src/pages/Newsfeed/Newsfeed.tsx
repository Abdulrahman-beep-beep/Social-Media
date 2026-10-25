import axios from "axios";
import PostCard from "../../components/PostCard/PostCard";
import Sidebar from "../../components/Sidebar/Sidebar";
import SuggestedFriends from "../../components/SuggestedFriends/SuggestedFriends";
import React, { useEffect, useState } from "react";
import { getUserFeed } from "../../services/feed.service";
import type { PostCardI } from "../../Types/postCard.types";
import PostSkeleton from "../../components/PostCard/PostSkeleton";
import PostComposer from "../../components/PostComposer/PostComposer";

function Newsfeed() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  async function getAllPost() {
      try {
        const { data } = await getUserFeed();
        // console.log(data);
        setPosts(data.data.posts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
  }
  useEffect(() => { getAllPost(); }, []);
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="hidden xl:col-span-2 xl:block">
          <Sidebar />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <PostComposer onCreated={getAllPost} />
          {isLoading ? <PostSkeleton/> : posts.map((post) => {
            return (
              <React.Fragment key={post._id}>
                <PostCard post={post}/>
              </React.Fragment>
            );
          })}
        </div>
        <div className="hidden xl:block xl:col-span-3">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
}
export default Newsfeed;