import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {
    const { username } = req.params;
    try {
        // Fetch the user profile from GitHub API
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            },
        });
        const userProfile = await userRes.json();

        // Fetch user repositories from GitHub API
        const repoRes = await fetch(userProfile.repos_url, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            },
        });
        const repos = await repoRes.json();

        // Increment profile visits in the database
        const userInDb = await User.findOne({ username });
        if (userInDb) {
            userInDb.profileVisits += 1; // Increment profile visit count
            await userInDb.save();
        }

        // Send the user profile and repositories as a response, including profileVisits
        res.status(200).json({
            userProfile,
            repos,
            profileVisits: userInDb?.profileVisits || 0, // Send profileVisits in the response
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const likeProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findById(req.user._id.toString());
        console.log(user, "auth user");
        const userToLike = await User.findOne({ username });

        if (!userToLike) {
            return res.status(404).json({ error: "User is not a member" });
        }

        if (user.likedProfiles.includes(userToLike.username)) {
            return res.status(400).json({ error: "User already liked" });
        }

        userToLike.likedBy.push({
            username: user.username,
            avatarUrl: user.avatarUrl,
            likedDate: Date.now(),
        });
        user.likedProfiles.push(userToLike.username);

        // Save both users' data
        await Promise.all([userToLike.save(), user.save()]);

        res.status(200).json({ message: "User liked" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        res.status(200).json({ likedBy: user.likedBy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// API handler to get liked profiles
export const getLikedProfiles = async (req, res) => {
  try {
    // Assuming `authUser` is the currently logged-in user
    const authUser = req.user; // Adjust according to your authentication logic

    // Fetch the liked profiles based on the `likedProfiles` array
    const likedProfiles = await User.find({
      username: { $in: authUser.likedProfiles }, // Find users who are in the likedProfiles array
    }).select("username avatarUrl"); // Select only the fields we need

    return res.json({ likedProfiles });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching liked profiles" });
  }
};

