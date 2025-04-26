const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://CaliRP:OpJdPvgxkB7nL5CZ@discordbot.fhcb6.mongodb.net/?retryWrites=true&w=majority&appName=DiscordBot"; // your MongoDB URL

const TranscriptSchema = new mongoose.Schema({
  ticketId: Number,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

// Avoid redefining model if it already exists
const Transcript = mongoose.models.Transcript || mongoose.model('Transcript', TranscriptSchema);

let isConnected = false;

module.exports = async function handler(req, res) {
  if (!isConnected) {
    await mongoose.connect(mongoURI);
    isConnected = true;
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  try {
    const transcript = await Transcript.findOne({ ticketId: id });
    
    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    return res.status(200).json({
      ticketId: transcript.ticketId,
      content: transcript.content,
      createdAt: transcript.createdAt
    });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
