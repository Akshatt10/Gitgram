import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";

const HomePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("recent");

  // Check if the user is authenticated by calling the /check route
  const checkUserAuthentication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/auth/check");
      const { user } = await res.json();
      if (user) {
        // If user is logged in, fetch their profile and repos
        getUserProfileAndRepos(user.username);
      } else {
        // Handle unauthenticated case (show sign-in prompt)
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error checking authentication.");
      setLoading(false);
    }
  }, []);

  // Function to fetch the user profile and repos
  const getUserProfileAndRepos = useCallback(async (username) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      const { repos, userProfile } = await res.json();

      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort repos by recent first

      setRepos(repos);
      setUserProfile(userProfile);
    } catch (error) {
      toast.error("Failed to fetch profile and repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger the authentication check when the component mounts
  useEffect(() => {
    checkUserAuthentication();
  }, [checkUserAuthentication]);

  const onSearch = async (e, username) => {
    e.preventDefault();
    setLoading(true);
    setRepos([]);
    setUserProfile(null);

    const { userProfile, repos } = await getUserProfileAndRepos(username);

    setUserProfile(userProfile);
    setRepos(repos);
    setLoading(false);
    setSortType("recent");
  };

  const onSort = (sortType) => {
    if (sortType === "recent") {
      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Descending, recent first
    } else if (sortType === "stars") {
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count); // Descending, most stars first
    } else if (sortType === "forks") {
      repos.sort((a, b) => b.forks_count - a.forks_count); // Descending, most forks first
    }
    setSortType(sortType);
    setRepos([...repos]);
  };

  // If not logged in, show the sign-in page
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="mt-4">Please sign in to see your profile and repositories.</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => (window.location.href = "/signup")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />
      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {!loading && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default HomePage;
