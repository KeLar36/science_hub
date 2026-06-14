exports.addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const validReactions = ["fire", "heart", "clap", "idea"];
    if (!validReactions.includes(type)) {
      return res.status(400).json({ message: "Невалідний тип реакції" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true },
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не знайдено" });
    }

    res.json({ reactions: updatedPost.reactions });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
