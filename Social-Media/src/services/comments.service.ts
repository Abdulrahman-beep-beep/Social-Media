import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("userToken")}` });
export async function getPostComments(postId: string) {
  return axios.get(`${baseUrl}/posts/${postId}/comments`, { headers: { ...headers(), "Content-Type": "application/json" } });
}
export async function createComment(postId: string, formData: FormData) {
  return axios.post(`${baseUrl}/posts/${postId}/comments`, formData, { headers: headers() });
}
export async function updateComment(postId: string, commentId: string, content: string) {
  return axios.put(`${baseUrl}/posts/${postId}/comments/${commentId}`, { content }, { headers: headers() });
}
export async function deleteComment(postId: string, commentId: string) {
  return axios.delete(`${baseUrl}/posts/${postId}/comments/${commentId}`, { headers: headers() });
}
