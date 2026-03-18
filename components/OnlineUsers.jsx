export default function OnlineUsers({ count }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      {count} admins online
    </div>
  );
}
