import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

export function useNotificationCount() {
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 3_000, // tự động cập nhật mỗi 30s (tùy chỉnh)
    staleTime: 20_000,
  });

  // Tổng số thông báo chưa đọc = pending (chờ accept) + accepted mới (tùy chọn)
  const pendingCount = friendRequests?.incomingReqs?.length || 0;
  const acceptedCount = friendRequests?.acceptedReqs?.length || 0;
  const rejectedCount = friendRequests?.rejectedReqs?.length || 0;

  // Bạn có thể chọn: chỉ đếm pending (phổ biến nhất)
  // hoặc pending + accepted mới (như Facebook)
  const total = pendingCount; // ← hiện tại chỉ đếm lời mời đang chờ
  //const total = pendingCount + acceptedCount + rejectedCount; // nếu muốn đếm cả "New Connections"

  return {
    count: total,
    isLoading,
    hasNotification: total > 0,
  };
}
