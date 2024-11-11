import io from 'socket.io-client';

export const socket = io(import.meta.env.VITE_BASE_URL);

const user = JSON.parse(sessionStorage.user || "{}")
if (user?._id) {
  socket.emit("register", user._id)
}
