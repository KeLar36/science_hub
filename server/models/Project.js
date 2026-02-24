const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, 
  
  domain: { 
    type: String, 
    required: true,
    default: 'Інше'
  },

  status: {
    type: String,
    default: 'На розгляді',
    enum: ['На розгляді', 'Прийнято', 'На доопрацюванні', 'Відхилено']
  },

  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemp',
    required: true
  },

  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },

  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemp',
    default: null
  },

  reviewerComments: {
    type: String,
    default: ''
  },

  reviewStatus: {
    type: String,
    default: 'Не призначено',
    enum: ['Не призначено', 'В процесі', 'Завершено']
  },

  versions: [{
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    authorComment: { type: String, default: '' }, 
    createdAt: { type: Date, default: Date.now }
  }],

  fileUrl: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);