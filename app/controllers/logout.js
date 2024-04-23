const logoutController = async (req, res) => {
  try {
    await req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default logoutController;
