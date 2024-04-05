const logoutController = async (req, res) => {
  await req.session.destroy();
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "Logged out successfully" });
};

export default logoutController;
