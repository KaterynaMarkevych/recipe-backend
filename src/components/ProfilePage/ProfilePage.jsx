export default function ProfilePage({ user }) {
  return (
    <div style={{ padding: "12rem" }}>
      <div className="bg-blue-200 p-6 rounded-md flex items-center gap-4">
        <img
          src={user.avatar}
          alt="User avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl  text-gray-700 font-semibold">
            {user.username}
          </h2>
          <p className="text-sm text-gray-700">{user.bio}</p>
          <p className="text-sm text-gray-600">{user.bio}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>{user.following} підписки</span>
            <span>{user.followers} підписників</span>
            <span>{user.published} опублікованих рецептів</span>
          </div>
          <button className="mt-3 px-4 py-1 border rounded hover:bg-white">
            Редагувати профіль
          </button>
        </div>
      </div>
    </div>
  );
}
