import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import relationAPI from "../../service/relationAPI";

export function ConfirmUnFriendDialog({ isOpen, onClose, relationId, username, onSuccess }) {
  const handleUnFriend = async () => {
    try {
      await relationAPI.unFriendAPI(relationId);
      onSuccess()
      onClose(); // Đóng dialog sau khi xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa bạn:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận</AlertDialogTitle>
          <AlertDialogDescription>
            {`Xóa ${username} khỏi danh sách bạn bè?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"bg-gray-300 hover:bg-gray-400"} onClick={onClose}>Không</AlertDialogCancel>
          <AlertDialogAction className={"bg-red-500 hover:bg-red-600"} onClick={handleUnFriend}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
