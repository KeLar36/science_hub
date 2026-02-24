const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
	try {
		const { category } = req.query;
		let query = {};
		if (category && category !== 'Всі') {
			query.category = category;
		}
		const posts = await Post.find(query).sort({ createdAt: -1 });
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: "Помилка при отриманні постів" });
	}
});

router.post('/create', verifyToken, checkRole(['admin', 'content-manager']), upload.single('image'), async (req, res) => {
	try {
		const { title, content, category, status } = req.body;

		const newPost = new Post({
			title,
			content,
			category,
			status,
			authorId: req.user.id,
			coverImage: req.file ? req.file.location : null
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (err) {
		console.error("Помилка на сервері:", err);
		res.status(500).json({ message: "Не вдалося створити пост", error: err.message });
	}
});

router.put('/:id', verifyToken, checkRole(['admin', 'content-manager']), upload.single('image'), async (req, res) => {
	try {
		let updateData = { ...req.body };
		if (req.file) {
			updateData.coverImage = req.file.location;
		}

		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ $set: updateData },
			{ new: true }
		);
		res.json(updatedPost);
	} catch (err) {
		res.status(500).json({ message: "Помилка при оновленні" });
	}
});

router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
	try {
		await Post.findByIdAndDelete(req.params.id);
		res.json({ message: "Пост успішно видалено" });
	} catch (err) {
		res.status(500).json({ message: "Помилка при видаленні" });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Пост не знайдено" });
		}
		res.json(post);
	} catch (err) {
		console.error("Помилка при отриманні поста:", err);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ message: "Некоректний формат ID" });
		}
		res.status(500).json({ message: "Помилка сервера" });
	}
});

module.exports = router;