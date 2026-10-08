import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  imagePath: {
    type: String,
    required: true,
  },
  // GeoJSON for 2dsphere indexing
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  department: {
    type: String,
    default: null
  },
  proofOfFixImagePath: {
    type: String,
    default: null
  },
  detectedIssue: {
    type: String,
    default: 'Unknown'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'low', 'medium', 'high', 'critical'],
    default: 'Medium'
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  statusHistory: [{
    from: String,
    to: String,
    by: String,
    at: { type: Date, default: Date.now }
  }]
});

// Add 2dsphere index for geospatial queries
reportSchema.index({ location: '2dsphere' });

const Report = mongoose.model('Report', reportSchema);

export default Report;
