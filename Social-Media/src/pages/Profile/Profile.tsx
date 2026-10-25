import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { KeyRound, UserRound } from "lucide-react";
import PostCard from "../../components/PostCard/PostCard";
import { getProfile, changePassword } from "../../services/profile.service";
import { getUserFeed } from "../../services/feed.service";
import type { PostCardI } from "../../Types/postCard.types";

type ProfileUser = { _id?: string; id?: string; name?: string; username?: string; email?: string; photo?: string; dateOfBirth?: string; gender?: string };
export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  async function loadProfile() {
    setLoading(true);
    try {
      const [profileResponse, feedResponse] = await Promise.all([getProfile(), getUserFeed()]);
      const profileData = profileResponse.data?.data?.user || profileResponse.data?.data?.profile || profileResponse.data?.user || profileResponse.data?.data;
      setUser(profileData);
      const allPosts: PostCardI[] = feedResponse.data?.data?.posts || [];
      const id = profileData?._id || profileData?.id;
      setPosts(id ? allPosts.filter(post => post.user?._id === id) : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not load your profile");
    } finally { setLoading(false); }
  }
  useEffect(() => { loadProfile(); }, []);
  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      const { data } = await changePassword(currentPassword, newPassword, confirmPassword);
      toast.success(data.message || "Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error: any) { toast.error(error?.response?.data?.message || "Could not change password. Check the API endpoint and fields."); }
    finally { setSaving(false); }
  }
  return <main className="mx-auto max-w-4xl px-4 py-8">
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-500" />
      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <img className="size-24 rounded-full border-4 border-white bg-gray-100 object-cover" src={user?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} alt={user?.name || "Profile"}/>
          <div className="pb-2"><h1 className="text-2xl font-bold text-gray-900">{user?.name || "My Profile"}</h1><p className="text-sm text-gray-500">{user?.username ? `@${user.username}` : user?.email || "Your account"}</p></div>
        </div>
        <div className="mt-5 flex gap-6 border-t pt-4 text-sm text-gray-600"><span><b className="text-gray-900">{posts.length}</b> Posts</span>{user?.email && <span>{user.email}</span>}</div>
      </div>
    </section>
    <section className="my-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><KeyRound size={19}/> Change password</h2>
      <form onSubmit={submitPassword} className="grid gap-3 sm:grid-cols-3">
        <input required type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <input required type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <input required type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-3">{saving ? "Saving..." : "Update password"}</button>
      </form>
    </section>
    <section><h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><UserRound size={20}/> My posts</h2>{loading ? <p className="py-8 text-center text-gray-500">Loading profile...</p> : posts.length ? posts.map(post => <PostCard key={post._id} post={post}/>) : <div className="rounded-xl border bg-white p-8 text-center text-gray-500">No posts found for this profile yet.</div>}</section>
  </main>;
}
