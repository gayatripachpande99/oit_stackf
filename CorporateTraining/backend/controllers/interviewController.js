const InterviewFeedback = require('../models/InterviewFeedback');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const config = require('../config/env');

let openai = null;
if (config.openaiApiKey) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: config.openaiApiKey });
  } catch (err) {
    console.warn('OpenAI SDK failed to load. Using mock fallback interviewer.', err.message);
  }
}

const HR_QUESTIONS = [
  "Hello! Thank you for joining us today. To start off, could you tell me a little about yourself and why you're interested in the OIT_STACK Preparation Portal?",
  "That sounds interesting! What would you say is your greatest strength, and how do you handle high-pressure situations or tight deadlines?",
  "Great. Can you describe a time when you had a conflict within a team project and how you went about resolving it?",
  "Excellent. Where do you see yourself in five years, and what career goals are you aiming to achieve next?",
  "Thank you. That concludes our HR questions. Feel free to submit the interview to get detailed performance feedback."
];

const TECH_QUESTIONS = [
  "Hello! Welcome to the technical round. Let's start with some fundamentals. Can you explain the difference between a Process and a Thread in operating systems?",
  "Good. Now, coming to data structures. Can you explain the time complexity of searching in a Binary Search Tree (BST) in the average and worst cases?",
  "Excellent. In Database Management Systems, what are ACID properties, and why are they crucial in transaction management?",
  "Great. Let's discuss Object-Oriented Programming. Can you explain the difference between Method Overloading and Method Overriding, with examples if possible?",
  "Excellent response. That covers the technical questions. Please click 'End Interview' to see your comprehensive analysis."
];

const startInterview = async (req, res) => {
  try {
    const { type } = req.body; // 'hr' or 'technical'

    if (!type || !['hr', 'technical'].includes(type)) {
      return errorResponse(res, 400, 'Invalid interview type. Must be hr or technical.');
    }

    const firstQuestion = type === 'hr' ? HR_QUESTIONS[0] : TECH_QUESTIONS[0];

    return successResponse(res, 200, 'Interview started successfully', {
      question: firstQuestion,
      history: [
        { role: 'assistant', content: firstQuestion }
      ]
    });
  } catch (error) {
    console.error('Start interview error:', error.message);
    return errorResponse(res, 500, 'Server error starting interview');
  }
};

const sendAnswer = async (req, res) => {
  try {
    const { type, history, answer } = req.body;

    if (!type || !history || !Array.isArray(history) || !answer) {
      return errorResponse(res, 400, 'Missing type, history, or answer in request body');
    }

    const updatedHistory = [...history, { role: 'user', content: answer }];

    if (openai) {
      try {
        const systemPrompt = type === 'hr'
          ? "You are an experienced HR interviewer conducting a placement interview. Ask behavioral questions about teamwork, leadership, strengths, weaknesses, career goals. Be professional and encouraging. After the candidate answers, provide brief feedback (1-2 sentences) and ask the next follow-up question. Do not exceed 5 questions in total."
          : "You are a senior technical interviewer. Ask questions about data structures, algorithms, OOP, DBMS, OS, CN based on the candidate's level. Start easy and progressively increase difficulty. Provide hints if the candidate struggles. After the candidate answers, provide brief technical feedback (1-2 sentences) and ask the next technical question. Do not exceed 5 questions in total.";

        const messages = [
          { role: 'system', content: systemPrompt },
          ...updatedHistory
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 250,
          temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;
        updatedHistory.push({ role: 'assistant', content: aiResponse });

        return successResponse(res, 200, 'Answer processed', {
          question: aiResponse,
          history: updatedHistory
        });
      } catch (openAiError) {
        console.error('OpenAI API call failed, falling back to mock evaluator:', openAiError.message);
      }
    }

    const userAnswersCount = updatedHistory.filter(msg => msg.role === 'user').length;
    const questionsList = type === 'hr' ? HR_QUESTIONS : TECH_QUESTIONS;

    let nextQuestion = '';
    let feedback = '';

    if (userAnswersCount < questionsList.length) {
      nextQuestion = questionsList[userAnswersCount];
      feedback = "Good point. You structured your thoughts well.";
    } else {
      nextQuestion = "Thank you for your responses. The interview is now complete. Please submit to generate your dashboard review.";
      feedback = "Excellent discussion. That covers all my questions.";
    }

    const assistantMsg = `${feedback} ${nextQuestion}`;
    updatedHistory.push({ role: 'assistant', content: assistantMsg });

    return successResponse(res, 200, 'Answer processed successfully', {
      question: assistantMsg,
      history: updatedHistory
    });
  } catch (error) {
    console.error('Send answer error:', error.message);
    return errorResponse(res, 500, 'Server error processing answer');
  }
};

const endInterview = async (req, res) => {
  try {
    const { type, history, duration } = req.body;

    if (!type || !history || !Array.isArray(history)) {
      return errorResponse(res, 400, 'Missing type or conversation history');
    }

    const userMsgs = history.filter(m => m.role === 'user').map(m => m.content);
    const assistantMsgs = history.filter(m => m.role === 'assistant').map(m => m.content);

    let scores = { communication: 8, confidence: 8, technical: 7, overall: 8 };
    let finalFeedback = [
      "Demonstrated good composure throughout the session.",
      "Communication was clear and structured, though could be more concise.",
      "Showed a solid understanding of fundamental concepts."
    ];

    if (openai && userMsgs.length > 0) {
      try {
        const evaluationPrompt = `You are a placement committee evaluator. Analyze the following mock interview transcript between an interviewer and a candidate.
        Evaluate the candidate on a scale of 1 to 10 for communication, confidence, and ${type === 'technical' ? 'technical knowledge' : 'hr compatibility'}.
        Provide a JSON response containing:
        1. "scores": { "communication": number, "confidence": number, "technical": number, "overall": number }
        2. "feedback": string[] (An array of 3 bullet points with detailed improvement suggestions)

        Format the response strictly as valid JSON.

        Transcript:
        ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`;

        const evaluation = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: evaluationPrompt }],
          max_tokens: 400,
          temperature: 0.5,
        });

        const rawJsonText = evaluation.choices[0].message.content.trim();
        const cleanJsonText = rawJsonText.replace(/^```json/, '').replace(/```$/, '').trim();

        const evalResult = JSON.parse(cleanJsonText);
        if (evalResult.scores && evalResult.feedback) {
          scores = evalResult.scores;
          finalFeedback = evalResult.feedback;
        }
      } catch (openAiError) {
        console.error('OpenAI evaluation failed, using fallback metrics:', openAiError.message);
      }
    }

    if (type === 'hr') {
      scores.technical = scores.overall; // Set technical score equal to overall for HR interviews
    }

    const feedbackRecord = await InterviewFeedback.create({
      user: req.user._id,
      type,
      questions: assistantMsgs.slice(0, userMsgs.length), // Match questions with answers
      answers: userMsgs,
      feedback: finalFeedback,
      scores,
      duration: duration || 0,
    });

    return successResponse(res, 201, 'Interview completed and saved', feedbackRecord);
  } catch (error) {
    console.error('End interview error:', error.message);
    return errorResponse(res, 500, 'Server error evaluating interview');
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const history = await InterviewFeedback.find({ user: req.user._id })
      .sort({ completedAt: -1 });

    return successResponse(res, 200, 'Interview history retrieved successfully', history);
  } catch (error) {
    console.error('Get interview history error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving interview history');
  }
};

const getAllStudentInterviews = async (req, res) => {
  try {
    const { page = 1, limit = 25, search, type, score, range } = req.query;
    
    const query = {};

    // Date Range Filter
    if (range && range !== 'all') {
      const now = new Date();
      let startDate = new Date();
      if (range === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (range === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (range === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      query.createdAt = { $gte: startDate };
    }

    // Type Filter
    if (type) {
      query.type = type;
    }

    // Score Filter
    if (score) {
      if (score === 'high') {
        query['scores.overall'] = { $gte: 8 };
      } else if (score === 'mid') {
        query['scores.overall'] = { $gte: 5, $lte: 7 };
      } else if (score === 'low') {
        query['scores.overall'] = { $lt: 5 };
      }
    }

    // Search filter (name, email, branch)
    if (search) {
      const regex = new RegExp(search, 'i');
      const users = await User.find({
        $or: [
          { name: regex },
          { email: regex },
          { branch: regex }
        ]
      }).select('_id');
      const matchingUserIds = users.map(u => u._id);
      query.user = { $in: matchingUserIds };
    }

    // Count before pagination
    const totalInterviews = await InterviewFeedback.countDocuments(query);
    const totalPages = Math.ceil(totalInterviews / parseInt(limit));
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records
    const history = await InterviewFeedback.find(query)
      .populate('user', 'name email branch college')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Stats calculation (unpaginated, but within the date filter if any)
    const allMatching = await InterviewFeedback.find(query).select('scores type');
    
    const totalCount = allMatching.length;
    let avgOverall = 0;
    let excellentCount = 0;
    let hrCount = 0;
    let techCount = 0;

    if (totalCount > 0) {
      let sum = 0;
      allMatching.forEach(it => {
        sum += (it.scores?.overall || 0);
        if ((it.scores?.overall || 0) >= 8) excellentCount++;
        if (it.type === 'hr') hrCount++;
        if (it.type === 'technical') techCount++;
      });
      avgOverall = parseFloat((sum / totalCount).toFixed(1));
    }

    const excellentRate = totalCount > 0 ? Math.round((excellentCount / totalCount) * 100) : 0;

    return successResponse(res, 200, 'All student mock interviews retrieved successfully', {
      interviews: history,
      pagination: {
        totalInterviews,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      stats: {
        totalInterviews: totalCount,
        avgOverall,
        excellentRate,
        hrCount,
        techCount
      }
    });

  } catch (error) {
    console.error('Get all student interviews error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving all student mock interviews');
  }
};

module.exports = {
  startInterview,
  sendAnswer,
  endInterview,
  getInterviewHistory,
  getAllStudentInterviews
};

