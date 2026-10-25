import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("userToken")}` });
export async function getSinglePost(postId: string) {
  return axios.get(`${baseUrl}/posts/${postId}`, { headers: { ...headers(), "Content-Type": "application/json" } });
}
export async function createPost(formData: FormData) {
  return axios.post(`${baseUrl}/posts`, formData, { headers: headers() });
}
export async function updatePost(postId: string, formData: FormData) {
  return axios.put(`${baseUrl}/posts/${postId}`, formData, { headers: headers() });
}
export async function deletePost(postId: string) {
  return axios.delete(`${baseUrl}/posts/${postId}`, { headers: headers() });
}
