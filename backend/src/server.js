// Import các thư viện cần thiết
import express from "express"; // Framework tạo server HTTP
import "dotenv/config"; // Đọc các biến môi trường từ file .env
import cookieParser from "cookie-parser"; // Dùng để đọc và xử lý cookie
import cors from "cors"; // Cho phép truy cập từ domain khác (Cross-Origin Resource Sharing)
import path from "path"; // Xử lý đường dẫn file/thư mục trong hệ thống

// Import các route (đường dẫn API)
import authRoutes from "./routes/auth.route.js"; // Xử lý các API liên quan đến đăng nhập/đăng ký
import userRoutes from "./routes/user.route.js"; // Xử lý các API liên quan đến người dùng
import chatRoutes from "./routes/chat.route.js"; // Xử lý các API liên quan đến chat

// Import hàm kết nối cơ sở dữ liệu
import { connectDB } from "./lib/db.js"; // Hàm kết nối MongoDB hoặc database khác

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT; // Lấy cổng từ biến môi trường (.env)

// Lấy đường dẫn gốc của project (thư mục hiện tại)
const __dirname = path.resolve();

// Cấu hình CORS – cho phép frontend (localhost:5173) truy cập API backend
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // Domain frontend (Vite hoặc React)
      credentials: true, // Cho phép gửi cookie từ frontend
    })
  );
}

// Cho phép Express tự động parse dữ liệu JSON từ request body
app.use(express.json());

// Cho phép Express đọc cookie từ client
app.use(cookieParser());

// Định nghĩa các route API
app.use("/api/auth", authRoutes); // Các endpoint bắt đầu bằng /api/auth
app.use("/api/users", userRoutes); // Các endpoint bắt đầu bằng /api/users
app.use("/api/chat", chatRoutes); // Các endpoint bắt đầu bằng /api/chat

// Cấu hình cho môi trường Production (khi deploy)
if (process.env.NODE_ENV === "production") {
  // Chỉ định thư mục chứa file build của frontend (React/Vite)
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Xử lý tất cả request không khớp route → trả về file index.html (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Khởi động server và kết nối cơ sở dữ liệu
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Kết nối đến database khi server khởi chạy
});
