const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const JobSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  jobTitle: {
    type: String,
    required: [true, 'Please enter a job title'],
  },
  companyName: {
    type: String,
    required: [true, 'Please enter a company name'],
  },
  website: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  address: {
    type: String,
  },
  origin: {
    type: String,
  },
  status: {
    type: String,
  },
  comments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Job', JobSchema);


