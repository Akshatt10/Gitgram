import { useAuthContext } from "../context/auth.context";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // To handle redirection
import toast from "react-hot-toast";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";

const HomePage = () => {
	const { authUser, loading: authLoading } = useAuthContext(); // Access authUser from context
	const [userProfile, setUserProfile] = useState(null);
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sortType, setSortType] = useState("recent");
	const navigate = useNavigate(); // React Router hook for navigation

	const getUserProfileAndRepos = useCallback(
		async (username) => {
			if (!username) {
				toast.error("Username not provided.");
				return;
			}
			setLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const { repos, userProfile } = await res.json();

				repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by recent first

				setRepos(repos);
				setUserProfile(userProfile);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		// Redirect to sign-up if no authUser and not loading
		if (!authLoading && !authUser) {
			navigate("/signup");
		}

		// Fetch data for the logged-in user
		if (authUser) {
			getUserProfileAndRepos(authUser.username);
		}
	}, [authUser, authLoading, getUserProfileAndRepos, navigate]);

	const onSearch = async (e, username) => {
		e.preventDefault();
		setLoading(true);
		setRepos([]);
		setUserProfile(null);

		await getUserProfileAndRepos(username);

		setLoading(false);
		setSortType("recent");
	};

	const onSort = (sortType) => {
		if (sortType === "recent") {
			repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (sortType === "stars") {
			repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortType === "forks") {
			repos.sort((a, b) => b.forks_count - a.forks_count);
		}
		setSortType(sortType);
		setRepos([...repos]);
	};

	if (authLoading || loading) return <Spinner />;

	return (
		<div className="m-4">
			<Search onSearch={onSearch} />
			{repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
			<div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
				{userProfile && <ProfileInfo userProfile={userProfile} />}
				<Repos repos={repos} />
			</div>
		</div>
	);
};

export default HomePage;
