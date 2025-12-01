import { upsertStreamUser, generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const user = req.user; // Được gắn từ middleware protectRoute

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Đảm bảo user có trên hệ thống Stream
    await upsertStreamUser({
      id: user._id.toString(), // ⚠️ dùng _id (MongoDB field)
      name: user.fullName || `User ${user._id}`,
      image: user.profilePic || "https://i.imgur.com/fR9Jz14.png",
    });

    // Tạo Stream token
    const token = generateStreamToken(user._id.toString());

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
