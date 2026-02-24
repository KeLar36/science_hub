const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	category: { type: String, required: true },
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	coverImage: { type: String },
	status: { type: String, enum: ['draft', 'published'], default: 'draft' },
	views: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);