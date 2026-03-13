export const checkBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarks.includes(req.params.id);
    res.json({ isBookmarked });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    const index = user.bookmarks.indexOf(postId);
    if (index === -1) {
      user.bookmarks.push(postId);
      await user.save();
      return res.json({ message: "Додано до закладок", isBookmarked: true });
    } else {
      user.bookmarks.splice(index, 1);
      await user.save();
      return res.json({ message: "Видалено з закладок", isBookmarked: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};
