import { useCallback, useState, useEffect, useContext } from "react";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { AuthContext, useAuthContext } from "../context/AuthContext"; // Add your AuthContext or similar

const HomePage = () => {
  const { user } = useContext(useAuthContext); // Check if the user is authenticated
  const [userProfile, setuserProfile] = useState(null);
  const [repos, setrepos] = useState([]);
  const [loading, setloading] = useState(false);
  const [sortType, setsortType] = useState("recent");

  const getUserProfileAndRepos = useCallback(async (username) => {
    setloading(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      const { repos, userProfile } = await res.json();

      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setrepos(repos);
      setuserProfile(userProfile);

      return { userProfile, repos };
    } catch (error) {
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  }, []);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setloading(true);
    setrepos([]);
    setuserProfile(null);

    const { userProfile, repos } = await getUserProfileAndRepos(username);

    setuserProfile(userProfile);
    setrepos(repos);
    setloading(false);
    setsortType("recent");
  };

  const onSort = (sortType) => {
    if (sortType === "recent") {
      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Descending, recent first
    } else if (sortType === "stars") {
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count); // Descending, most stars first
    } else if (sortType === "forks") {
      repos.sort((a, b) => b.forks_count - a.forks_count); // Descending, most forks first
    }
    setsortType(sortType);
    setrepos([...repos]);
  };

  if (!user) {
    // If user is not authenticated, show sign-in or sign-up options
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Welcome to My App</h1>
        <p className="mt-4">Please sign in or sign up to continue.</p>
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

  // Authenticated user flow
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
