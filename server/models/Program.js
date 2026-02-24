const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  category: { type: String, default: 'Науковий журнал' },
  
  domain: { 
    type: String, 
    required: true, 
    default: 'Загальний напрямок' 
  }, 
  
  issn: { type: String },
  impactFactor: { type: String }, 
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', ProgramSchema);