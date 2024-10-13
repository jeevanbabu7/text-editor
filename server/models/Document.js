import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: Object, // Store the Quill delta format
    required: true,
    default: { }
  },
  collaborators:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    }],
  creator: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Add timestamps to track when the document is created or updated

const Document = mongoose.model('Document', documentSchema);

export default Document;
