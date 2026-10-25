import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("userToken")}` });
export async function getProfile() {
  return axios.get(`${baseUrl}/users/profile-data`, { headers: headers() });
}
export async function getUserPosts(userId: string) {
  return axios.get(`${baseUrl}/users/${userId}/posts`, { headers: headers() });
}
export async function changePassword(currentPassword: string, password: string, rePassword: string) {
  return axios.patch(`${baseUrl}/users/change-password`, { password: currentPassword, newPassword: password, rePassword }, { headers: headers() });
}
