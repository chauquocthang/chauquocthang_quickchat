// FriendPage.jsx - ĐÃ CẬP NHẬT VỚI TÌM KIẾM + CHẤM ĐỎ THÔNG BÁO

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import {
  UsersIcon,
  SearchIcon, // Thêm icon tìm kiếm
} from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

// Hook thông báo (đã tạo từ trước)
import { useNotificationCount } from "../hooks/useNotificationCount";

const FriendPage = () => {
  const queryClient = useQueryClient();

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy số lượng lời mời kết bạn để hiện chấm đỏ
  const { count: notificationCount } = useNotificationCount();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Lọc danh sách bạn bè theo tên (realtime, không phân biệt hoa thường)
  const filteredFriends = useMemo(() => {
    if (!searchTerm.trim()) return friends;

    const lowerSearch = searchTerm.toLowerCase();
    return friends.filter((friend) =>
      friend.fullName.toLowerCase().includes(lowerSearch)
    );
  }, [friends, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* HEADER + NÚT THÔNG BÁO + TÌM KIẾM */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Nút Friend Requests có chấm đỏ */}
          <Link to="/notifications" className="btn btn-outline btn-sm relative">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
            {/* Chấm đỏ + số lượng */}
            {notificationCount > 0 && (
              <div className="badge badge-error badge-xs absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold">
                {notificationCount > 99 ? "99+" : notificationCount}
              </div>
            )}
          </Link>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Friends
          <span className="text-lg font-normal text-base-content/60 ml-3">
            ({friends.length})
          </span>
        </h2>
        {/* THANH TÌM KIẾM */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/50" />
          <input
            type="text"
            placeholder="Search friends by name..."
            className="input input-bordered w-full pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Nút xóa nhanh */}
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        {/* NỘI DUNG DANH SÁCH BẠN BÈ */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : filteredFriends.length === 0 ? (
          /* Khi tìm kiếm không ra */
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">
              No friends found for "
              <span className="font-semibold">{searchTerm}</span>"
            </p>
            <p className="text-sm text-base-content/50 mt-2">
              Try searching with a different name
            </p>
          </div>
        ) : (
          /* Danh sách bạn bè đã lọc */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPage;
