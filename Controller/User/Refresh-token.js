const jwt = require("jsonwebtoken");

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(404).send("Refresh token missing");
    }

    jwt.verify(refreshToken, process.env.JWT_TOKEN, (error, user) => {
        if (error) {
            return res.status(403).send("Refresh token is invalid");
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_TOKEN,
            { expiresIn: "30m" }
        );

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 60 * 1000, // 30 minutes
            sameSite: "lax",
        });

        return res.status(200).json({ accessToken });
    });
};

// admin refresh token ....

const adminrefreshAccessToken = async (req,res) =>{
    const adminrefreshToken = req.cookies.adminrefreshToken;
    if (!adminrefreshToken) {
        return res.status(404).send(" admin Refresh token missing");
    }

    jwt.verify(adminrefreshToken, process.env.ADMIN_JWT_TOKEN, (error, user) => {
        if (error) {
            return res.status(403).send("Refresh token is invalid");
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.ADMIN_JWT_TOKEN,
            { expiresIn: "30m" }
        );

        res.cookie("admintoken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 60 * 1000, // 30 minutes
            sameSite: "lax",
        });

        return res.status(200).json({ accessToken });
    });
}

module.exports = { refreshAccessToken,adminrefreshAccessToken };