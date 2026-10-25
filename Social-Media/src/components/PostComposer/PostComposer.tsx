import { useState, type FormEvent, type ChangeEvent } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { createPost } from "../../services/post.service";

export default function PostComposer({ onCreated }: { onCreated: () => void }) {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  function chooseImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() && !image) { toast.error("Write something or add an image first."); return; }
    const form = new FormData();
    if (body.trim()) form.append("body", body.trim());
    if (image) form.append("image", image);
    setLoading(true);
    try {
      const { data } = await createPost(form);
      toast.success(data.message || "Post published");
      setBody(""); setImage(null); setPreview(""); onCreated();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Could not publish post"); }
    finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="What's on your mind?" className="w-full resize-y rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-blue-400" />
    {preview && <div className="relative mt-3 inline-block"><img src={preview} alt="Preview" className="max-h-64 rounded-xl object-cover" /><button type="button" aria-label="Remove image" onClick={() => { setImage(null); setPreview(""); }} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"><X size={16}/></button></div>}
    <div className="mt-3 flex items-center justify-between border-t pt-3"><label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"><ImagePlus size={18}/> Add photo<input type="file" accept="image/*" className="hidden" onChange={chooseImage}/></label><button disabled={loading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Send size={16}/>{loading ? "Publishing..." : "Publish"}</button></div>
  </form>;
}
