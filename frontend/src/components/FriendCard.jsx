import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfriendUser } from "../lib/api"; // ← thêm import này
import { UserMinus } from "lucide-react";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  const { mutate: unfriend, isPending } = useMutation({
    mutationFn: unfriendUser,
    onSuccess: () => {
      // Tự động cập nhật danh sách bạn bè ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const handleUnfriend = () => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${friend.fullName} khỏi danh sách bạn bè?`
      )
    ) {
      unfriend(friend._id);
    }
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center justify-between mb-3">
          {/* Avatar + Tên */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img
                  src={friend.profilePic || "/default-avatar.png"}
                  alt={friend.fullName}
                  className="object-cover"
                />
              </div>
            </div>
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
          </div>

          {/* Nút Xóa kết bạn – icon nằm giữa hoàn hảo */}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* NÚT MESSAGE + UNFRIEND */}
        <div className="flex gap-2">
          <Link to={`/chat/${friend._id}`} className="btn btn-primary flex-1">
            Message
          </Link>
          <button
            onClick={handleUnfriend}
            disabled={isPending}
            className="btn btn-ghost btn-square tooltip tooltip-left flex items-center justify-center"
            data-tip="UnFriend"
          >
            <UserMinus className="w-5 h-5 text-error" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

// giữ nguyên hàm getLanguageFlag cũ của bạn
export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
