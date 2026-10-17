const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const Category = require('../models/Category');
const { updateLeaderboard } = require('./leaderboardController');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getTests = async (req, res) => {
  try {
    const { category, subcategory, difficulty, type } = req.query;
    const filter = { isActive: true };

    if (req.user && req.user.role === 'admin') {
      delete filter.isActive;
    } else if (req.user) {
      filter.$or = [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: new Date() } }
      ];
    }

    if (type) {
      const matchingCats = await Category.find({ type });
      filter.category = { $in: matchingCats.map(c => c._id) };
    }

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (difficulty) filter.difficulty = difficulty;

    const tests = await Test.find(filter)
      .populate('category', 'name type')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 });

    let testsData = tests;

    if (req.user && req.user.role === 'admin') {
      const results = await Result.find({});
      const statsMap = {};
      results.forEach(r => {
        const tId = r.test.toString();
        if (!statsMap[tId]) {
          statsMap[tId] = { attempts: 0, passed: 0 };
        }
        statsMap[tId].attempts++;
        if (r.passed) statsMap[tId].passed++;
      });

      testsData = tests.map(t => {
        const tObj = t.toObject();
        const stats = statsMap[t._id.toString()] || { attempts: 0, passed: 0 };
        tObj.attemptsCount = stats.attempts;
        tObj.passRate = stats.attempts > 0 ? Math.round((stats.passed / stats.attempts) * 100) : 0;
        return tObj;
      });
    } else if (req.user) {
      const results = await Result.find({ user: req.user._id });
      const resultsMap = {};
      results.forEach(r => {
        if (r.reattemptAllowed) return;
        resultsMap[r.test.toString()] = r;
      });

      testsData = tests.map(t => {
        const tObj = t.toObject();
        tObj.userResult = resultsMap[t._id.toString()] || null;
        return tObj;
      });
    }

    return successResponse(res, 200, 'Tests retrieved successfully', testsData);
  } catch (error) {
    console.error('Get tests error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving tests');
  }
};

const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('category', 'name type')
      .populate('subcategory', 'name');

    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    if (req.user.role !== 'admin') {
      const studentTestView = test.toObject();
      delete studentTestView.questions; // Strip questions to prevent inspecting answers
      return successResponse(res, 200, 'Test details retrieved successfully', studentTestView);
    }

    const adminTest = await Test.findById(req.params.id)
      .populate('category', 'name type')
      .populate('subcategory', 'name')
      .populate('questions');

    return successResponse(res, 200, 'Test details retrieved successfully', adminTest);
  } catch (error) {
    console.error('Get test error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving test');
  }
};

const createTest = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      questions,
      totalQuestions,
      totalTime,
      passingMarks,
      negativeMarking,
      negativeMarkValue,
      randomizeQuestions,
      shuffleOptions,
      difficulty,
      isActive,
      startDate,
      endDate,
      sections,
      instructions,
    } = req.body;

    if ((!questions || !Array.isArray(questions) || questions.length === 0) && (!sections || !Array.isArray(sections) || sections.length === 0)) {
      return errorResponse(res, 400, 'A test must have at least one question or section');
    }

    let calculatedTotalQuestions = totalQuestions;
    if (sections && Array.isArray(sections) && sections.length > 0) {
      let sum = 0;
      sections.forEach(s => sum += (s.count || 0));
      calculatedTotalQuestions = sum;
    } else if (questions && Array.isArray(questions)) {
      calculatedTotalQuestions = questions.length;
    }

    const test = await Test.create({
      name,
      description,
      category,
      subcategory,
      questions: questions || [],
      totalQuestions: calculatedTotalQuestions || 0,
      totalTime,
      passingMarks: passingMarks || 0,
      negativeMarking: negativeMarking || false,
      negativeMarkValue: negativeMarkValue || 0,
      randomizeQuestions: randomizeQuestions !== undefined ? randomizeQuestions : true,
      shuffleOptions: shuffleOptions || false,
      difficulty: difficulty || 'mixed',
      isActive: isActive !== undefined ? isActive : true,
      startDate,
      endDate,
      sections: sections || [],
      instructions: instructions || '',
      createdBy: req.user._id,
    });

    return successResponse(res, 201, 'Test created successfully', test);
  } catch (error) {
    console.error('Create test error:', error.message);
    return errorResponse(res, 500, 'Server error creating test');
  }
};

const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    return successResponse(res, 200, 'Test updated successfully', test);
  } catch (error) {
    console.error('Update test error:', error.message);
    return errorResponse(res, 500, 'Server error updating test');
  }
};

const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    return successResponse(res, 200, 'Test deleted successfully');
  } catch (error) {
    console.error('Delete test error:', error.message);
    return errorResponse(res, 500, 'Server error deleting test');
  }
};

const startTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('category', 'name type')
      .populate('subcategory', 'name');

    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    if (!test.isActive) {
      return errorResponse(res, 403, 'This test is currently inactive');
    }

    const now = new Date();
    if (test.startDate && now < new Date(test.startDate)) {
      return errorResponse(res, 400, `This test has not started yet. It opens on ${new Date(test.startDate).toLocaleString()}`);
    }
    if (test.endDate && now > new Date(test.endDate)) {
      return errorResponse(res, 400, `This test has ended on ${new Date(test.endDate).toLocaleString()}`);
    }

    const completedResults = await Result.find({ user: req.user._id, test: test._id, status: 'completed' });
    const hasActiveBlock = completedResults.length > 0 && completedResults.every(r => !r.reattemptAllowed);
    if (hasActiveBlock) {
      return errorResponse(res, 400, 'You have already completed this test.');
    }

    let testQuestions = [];
    let result = await Result.findOne({ user: req.user._id, test: test._id, status: 'in_progress' });
    
    if (result && result.answers && result.answers.length > 0) {
      // Session already exists, load the questions that were already assigned to this result
      const qIds = result.answers.map(ans => ans.question);
      testQuestions = await Question.find({ _id: { $in: qIds } }).select('-correctAnswer -explanation');
      
      const qMap = {};
      testQuestions.forEach(q => { qMap[q._id.toString()] = q; });
      testQuestions = qIds.map(id => qMap[id.toString()]).filter(q => q);
    } else {
      // Generate questions based on test sections rules
      if (test.sections && test.sections.length > 0) {
        for (const sec of test.sections) {
          if (sec.mode === 'manual') {
            const manualQuestions = await Question.find({ _id: { $in: sec.questionIds } }).select('-correctAnswer -explanation');
            const qMap = {};
            manualQuestions.forEach(q => { qMap[q._id.toString()] = q; });
            const ordered = sec.questionIds.map(id => qMap[id.toString()]).filter(q => q);
            testQuestions = testQuestions.concat(ordered);
          } else { // 'auto'
            const query = { isActive: true };
            if (sec.category) query.category = sec.category;
            if (sec.subcategories && sec.subcategories.length > 0) {
              query.subcategory = { $in: sec.subcategories };
            }
            const matchingQuestions = await Question.find(query).select('-correctAnswer -explanation');
            const shuffled = matchingQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, sec.count);
            testQuestions = testQuestions.concat(selected);
          }
        }
      } else {
        // Fallback to legacy test.questions or dynamicConfig
        if (test.isDynamic && test.dynamicConfig && test.dynamicConfig.length > 0) {
          for (const config of test.dynamicConfig) {
            const query = { isActive: true };
            if (config.category) query.category = config.category;
            if (config.subcategory) query.subcategory = config.subcategory;
            if (config.difficulty && config.difficulty !== 'mixed') query.difficulty = config.difficulty;

            const matchingQuestions = await Question.find(query).select('-correctAnswer -explanation');
            const shuffled = matchingQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, config.count);
            testQuestions = testQuestions.concat(selected);
          }
        } else {
          testQuestions = await Question.find({ _id: { $in: test.questions } }).select('-correctAnswer -explanation');
        }
      }

      if (test.randomizeQuestions) {
        testQuestions.sort(() => 0.5 - Math.random());
      }

      const initialAnswers = testQuestions.map(q => ({
        question: q._id,
        selectedAnswer: null,
        isCorrect: false,
        timeTaken: 0
      }));

      result = await Result.create({
        user: req.user._id,
        test: test._id,
        status: 'in_progress',
        answers: initialAnswers,
      });
    }

    const testData = test.toObject();
    testData.questions = testQuestions;

    return successResponse(res, 200, 'Test started successfully', {
      test: testData,
      resultId: result._id,
      existingAnswers: result.answers || []
    });
  } catch (error) {
    console.error('Start test error:', error.message);
    return errorResponse(res, 500, 'Server error starting test');
  }
};

const saveAnswer = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { questionId, selectedAnswer, timeTaken } = req.body;

    const result = await Result.findOne({ _id: resultId, user: req.user._id, status: 'in_progress' });
    if (!result) {
      return errorResponse(res, 404, 'Active test session not found');
    }

    // Find if answer already exists
    const existingIndex = result.answers.findIndex(ans => ans.question.toString() === questionId);
    
    if (existingIndex > -1) {
      result.answers[existingIndex].selectedAnswer = selectedAnswer;
      result.answers[existingIndex].timeTaken = (result.answers[existingIndex].timeTaken || 0) + (timeTaken || 0);
    } else {
      result.answers.push({
        question: questionId,
        selectedAnswer,
        timeTaken: timeTaken || 0,
      });
    }

    await result.save();
    return successResponse(res, 200, 'Answer saved successfully');
  } catch (error) {
    console.error('Save answer error:', error.message);
    return errorResponse(res, 500, 'Server error saving answer');
  }
};

const submitTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { resultId, answers, timeTaken, autoSubmitted, copyPasteViolation } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    const result = await Result.findOne({ _id: resultId, user: req.user._id });
    if (!result) {
      return errorResponse(res, 404, 'Result session not found');
    }

    // Load actual questions that were assigned to this student attempt session
    const questionIds = result.answers.map(ans => ans.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // Map categories to section marksPerQuestion if configured
    const categoryMarksMap = {};
    if (test.sections && test.sections.length > 0) {
      test.sections.forEach(sec => {
        categoryMarksMap[sec.category.toString()] = sec.marksPerQuestion || 1;
      });
    }

    let obtainedMarks = 0;
    let totalMarks = 0;
    const processedAnswers = [];

    // Map incoming answers from request body
    const bodyAnswerMap = {};
    if (answers && Array.isArray(answers)) {
      answers.forEach(ans => {
        bodyAnswerMap[ans.question.toString()] = ans;
      });
    }

    // Map existing answers in session
    const sessionAnswerMap = {};
    result.answers.forEach(ans => {
      sessionAnswerMap[ans.question.toString()] = ans;
    });

    result.answers.forEach(sessionAns => {
      const qIdStr = sessionAns.question.toString();
      const question = questionMap[qIdStr];
      if (!question) return;

      const sectionMarks = categoryMarksMap[question.category?.toString()];
      const marksVal = (sectionMarks !== undefined) ? sectionMarks : (question.marks || 1);
      
      totalMarks += marksVal;

      const incomingAns = bodyAnswerMap[qIdStr];
      const savedAns = sessionAnswerMap[qIdStr];

      let selectedAnswer = null;
      let qTimeTaken = 0;

      if (incomingAns) {
        selectedAnswer = incomingAns.selectedAnswer;
        qTimeTaken = incomingAns.timeTaken || 0;
      } else if (savedAns) {
        selectedAnswer = savedAns.selectedAnswer;
        qTimeTaken = savedAns.timeTaken || 0;
      }

      let isCorrect = false;
      if (selectedAnswer !== null && selectedAnswer !== undefined) {
        if (selectedAnswer === question.correctAnswer) {
          isCorrect = true;
          obtainedMarks += marksVal;
        } else {
          if (test.negativeMarking) {
            const penalty = test.negativeMarkValue || question.negativeMark || 0;
            obtainedMarks -= penalty;
          }
        }
      }

      processedAnswers.push({
        question: sessionAns.question,
        selectedAnswer,
        isCorrect,
        timeTaken: qTimeTaken,
      });
    });

    if (obtainedMarks < 0) obtainedMarks = 0;

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const passed = obtainedMarks >= (test.passingMarks || 0);

    result.answers = processedAnswers;
    result.totalMarks = totalMarks;
    result.obtainedMarks = obtainedMarks;
    result.percentage = percentage;
    result.passed = passed;
    result.timeTaken = timeTaken || 0;
    result.autoSubmitted = autoSubmitted || false;
    result.copyPasteViolation = copyPasteViolation || false;
    result.status = 'completed';
    result.submittedAt = Date.now();
    await result.save();

    const user = await User.findById(req.user._id);
    if (user) {
      const today = new Date().toDateString();
      const lastActive = user.streak.lastActiveDate
        ? new Date(user.streak.lastActiveDate).toDateString()
        : null;

      if (lastActive !== today) {
        let currentStreak = user.streak.currentStreak || 0;
        let longestStreak = user.streak.longestStreak || 0;

        if (lastActive) {
          const diffTime = Math.abs(new Date(today) - new Date(lastActive));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        user.streak.currentStreak = currentStreak;
        user.streak.longestStreak = longestStreak;
        user.streak.lastActiveDate = new Date();
        await user.save();
      }
    }

    await updateLeaderboard(req.user._id);

    return successResponse(res, 201, 'Test submitted successfully', result);
  } catch (error) {
    console.error('Submit test error:', error.message);
    return errorResponse(res, 500, 'Server error submitting test');
  }
};

const toggleTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return errorResponse(res, 404, 'Test not found');
    }

    test.isActive = !test.isActive;
    await test.save();

    return successResponse(res, 200, `Test status toggled to ${test.isActive ? 'Active' : 'Inactive'}`, test);
  } catch (error) {
    console.error('Toggle test error:', error.message);
    return errorResponse(res, 500, 'Server error toggling test status');
  }
};

module.exports = {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  startTest,
  saveAnswer,
  submitTest,
  toggleTest,
};


