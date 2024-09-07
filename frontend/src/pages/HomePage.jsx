import { useCallback, useState, useEffect } from 'react'
import Search from '../components/Search'
import SortRepos from '../components/SortRepos'
import ProfileInfo from '../components/ProfileInfo'
import Repos from '../components/Repos'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'




const HomePage = () => {

  const [userProfile, setuserProfile] = useState(null);
  const [repos, setrepos] = useState([]);
  const [loading, setloading] = useState(false);
  const [sortType, setsortType] = useState("forks");


  const getUserProfileAndRepos = useCallback(async (username = "Akshatt10") => {
    setloading(true)
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      //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
      const userProfile = await userRes.json();
      setuserProfile(userProfile);

      const repoRes = await fetch(userProfile.repos_url);
      const repos = await repoRes.json();
      setrepos(repos);

      console.log("userprofile:", userProfile);
      console.log("Repos:", repos);

      return { userProfile, repos }



    } catch (error) {
      toast.error(error.message)
    } finally {
      setloading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setloading(true);
    setrepos([]);
    setuserProfile(null);

    const { userProfile, repos } = await getUserProfileAndRepos(username);

    setuserProfile(userProfile);
    setrepos(repos);
    setloading(false);

  }
  return (
    <div className='m-4'>
      <Search onSearch={onSearch} />
      <SortRepos />
      <div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {!loading && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>

    </div>
  )
}

export default HomePage
