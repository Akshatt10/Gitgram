import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const LikedProfilesPage = () => {
  const { authUser } = useAuthContext();
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      try {
        const res = await fetch(`/api/users/liked-profiles`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);
        setLikedProfiles(data.likedProfiles);
      } catch (error) {
        toast.error("Error fetching liked profiles: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProfiles();
  }, []);

  if (!authUser) return <p>Please log in to view your liked profiles.</p>;

  if (loading) return <p>Loading liked profiles...</p>;

  if (likedProfiles.length === 0)
    return <p>You haven't liked any profiles yet.</p>;

  return (
    <div className="text-white p-5">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaHeart className="text-red-500" /> Liked Profiles
      </h1>
      <ul className="space-y-4">
        {likedProfiles.map((profile) => (
          <li
            key={profile.username}
            className="flex items-center gap-4 bg-glass p-3 rounded-md"
          >
            <img
              src={profile.avatarUrl}
              alt={`${profile.username}'s avatar`}
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <p className="font-bold text-lg">{profile.username}</p>
              {profile.likedDate && (
                <p className="text-sm text-gray-400">
                  Liked on: {new Date(profile.likedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedProfilesPage;
