const mongoose = require('mongoose');
const User = require('../models/User');
const InterviewFeedback = require('../models/InterviewFeedback');
const config = require('../config/env');

const seedInterviews = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding interviews.');

    const student = await User.findOne({ email: 'student@example.com' });
    if (!student) {
      console.error('Student user not found. Please run seedTests.js first.');
      process.exit(1);
    }

    // Clear existing interview feedbacks for this student to prevent bloat
    await InterviewFeedback.deleteMany({ user: student._id });

    // Seed 1: HR Interview (Excellent)
    await InterviewFeedback.create({
      user: student._id,
      type: 'hr',
      questions: [
        "Hello! Thank you for joining us today. To start off, could you tell me a little about yourself?",
        "What would you say is your greatest strength?"
      ],
      answers: [
        "I am a software engineering student passionate about full stack development and building web apps.",
        "My greatest strength is my problem-solving ability and capacity to learn new frameworks quickly."
      ],
      feedback: [
        "Clear articulation of background and goals.",
        "Strengths were backed by good project examples.",
        "Maintained great eye contact and confidence."
      ],
      scores: {
        communication: 9,
        confidence: 9,
        technical: 8,
        overall: 9
      },
      duration: 900,
      completedAt: new Date()
    });

    // Seed 2: Technical Interview (Average)
    await InterviewFeedback.create({
      user: student._id,
      type: 'technical',
      questions: [
        "Let's start. Can you explain the difference between a Process and a Thread?",
        "What is the average time complexity of searching in a BST?"
      ],
      answers: [
        "A process is an execution of a program, and a thread is a subset of a process sharing memory.",
        "It is O(log N) if the tree is balanced, but worst case is O(N) if unbalanced."
      ],
      feedback: [
        "Solid conceptual knowledge of OS threads.",
        "Good explanation of BST worst case.",
        "Could structure communications slightly better."
      ],
      scores: {
        communication: 7,
        confidence: 7,
        technical: 8,
        overall: 7
      },
      duration: 1200,
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    // Seed 3: Technical Interview (Needs Improvement)
    await InterviewFeedback.create({
      user: student._id,
      type: 'technical',
      questions: [
        "What are ACID properties in database systems?",
        "What is method overloading vs overriding?"
      ],
      answers: [
        "I don't remember all of them, but A stands for Atomicity.",
        "Overloading is same class, overriding is child class."
      ],
      feedback: [
        "Needs major revision on database ACID properties.",
        "OOP definitions were correct but lacked implementation examples.",
        "Maintained low confidence and hesitated during technical questions."
      ],
      scores: {
        communication: 5,
        confidence: 4,
        technical: 3,
        overall: 4
      },
      duration: 600,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    console.log('Successfully seeded 3 mock interviews!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedInterviews();
