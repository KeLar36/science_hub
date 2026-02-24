const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/auth');

// 1. СТВОРЕННЯ ПРОЄКТУ (Тільки авторизовані користувачі)
router.post('/create', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, programId, domain } = req.body;
    // authorId беремо автоматично з токена, щоб ніхто не міг створити проєкт від імені іншого
    const authorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "Будь ласка, завантажте файл (PDF або DOCX)" });
    }

    const newProject = new Project({
      title,
      description,
      authorId,
      programId,
      domain,
      fileUrl: req.file.location,
      versions: [{
        fileUrl: req.file.location,
        fileName: req.file.originalname,
        authorComment: 'Перша подача роботи'
      }],
      status: 'На розгляді'
    });

    await newProject.save();
    res.status(201).json({ message: 'Проєкт успішно створено!', project: newProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. ПОДАЧА НОВОЇ ВЕРСІЇ (Тільки автор проєкту)
router.patch('/revision/:id', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { authorComment } = req.body;
    if (!req.file) return res.status(400).json({ error: "Файл не обрано" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Проєкт не знайдено" });

    // Перевірка: чи цей користувач дійсно є автором?
    if (project.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Ви не можете редагувати чужий проєкт" });
    }

    const newVersion = {
      fileUrl: req.file.location,
      fileName: req.file.originalname,
      authorComment: authorComment || 'Виправлена версія за запитом рецензента',
      createdAt: new Date()
    };

    project.versions.push(newVersion);
    project.fileUrl = req.file.location;
    project.status = 'На розгляді';
    project.reviewStatus = 'В процесі';

    await project.save();
    res.json({ message: "Нову версію успішно додано!", project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/assign/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { reviewerId } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { reviewerId, reviewStatus: 'В процесі' },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/reviewer/:reviewerId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.reviewerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Доступ до чужих рецензій заборонено" });
    }

    const projects = await Project.find({ reviewerId: req.params.reviewerId })
      .populate('authorId', 'name email')
      .populate('programId', 'title')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/submit-review/:id', verifyToken, checkRole(['reviewer', 'admin']), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.reviewerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Ви не є рецензентом цього проєкту" });
    }

    const { reviewNotes, reviewerComments, status } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        reviewNotes,
        reviewerComments,
        reviewStatus: 'Завершено',
        status
      },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Ви не можете переглядати чужі проєкти" });
    }

    const projects = await Project.find({ authorId: req.params.userId })
      .populate('programId', 'title');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('authorId', 'name email')
      .populate('programId', 'title')
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;