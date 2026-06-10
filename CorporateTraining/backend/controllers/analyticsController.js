const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');
const CodingProblem = require('../models/CodingProblem');
const Result = require('../models/Result');
const Leaderboard = require('../models/Leaderboard');
const Category = require('../models/Category');
const InterviewFeedback = require('../models/InterviewFeedback');
const CodingSubmission = require('../models/CodingSubmission');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Date range filtering helper
const getDateFilter = (range, dateField = 'createdAt') => {
  if (!range || range === 'all') return {};
  const start = new Date();
  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    start.setDate(start.getDate() - 7);
  } else if (range === 'month') {
    start.setMonth(start.getMonth() - 1);
  } else {
    return {};
  }
  return { [dateField]: { $gte: start } };
};

const getDashboardStats = async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilterUser = getDateFilter(range, 'createdAt');
    const dateFilterResult = getDateFilter(range, 'submittedAt');
    const dateFilterTest = getDateFilter(range, 'createdAt');
    const dateFilterQuestion = getDateFilter(range, 'createdAt');
    const dateFilterCoding = getDateFilter(range, 'createdAt');

    const totalStudents = await User.countDocuments({ role: 'student', ...dateFilterUser });
    const totalTests = await Test.countDocuments({ isActive: true, ...dateFilterTest });
    const totalQuestions = await Question.countDocuments({ isActive: true, ...dateFilterQuestion });
    const totalCodingProblems = await CodingProblem.countDocuments({ isActive: true, ...dateFilterCoding });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: sevenDaysAgo }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const testsTakenToday = await Result.countDocuments({
      submittedAt: { $gte: startOfToday }
    });

    const recentStudents = await User.find({ role: 'student' })
      .select('name email branch year createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSubmissions = await Result.find(dateFilterResult)
      .populate('user', 'name')
      .populate('test', 'name')
      .sort({ submittedAt: -1 })
      .limit(5);

    // Dynamic Summary KPIs
    const totalSubmissions = await Result.countDocuments(dateFilterResult);
    
    const avgScoreResult = await Result.aggregate([
      { $match: dateFilterResult },
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
    ]);
    const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    const passedCount = await Result.countDocuments({ passed: true, ...dateFilterResult });
    const overallPassRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

    const activeStudentsThisWeek = await User.countDocuments({
      role: 'student',
      $or: [
        { 'streak.lastActiveDate': { $gte: sevenDaysAgo } },
        { updatedAt: { $gte: sevenDaysAgo } }
      ]
    });

    return successResponse(res, 200, 'Dashboard statistics retrieved', {
      stats: {
        totalStudents,
        totalTests,
        totalQuestions,
        totalCodingProblems,
        recentRegistrations,
        testsTakenToday,
        totalSubmissions,
        avgScore,
        overallPassRate,
        activeStudentsThisWeek
      },
      recentStudents,
      recentSubmissions
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving dashboard statistics');
  }
};

const getStudentAnalytics = async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilterUser = getDateFilter(range, 'createdAt');
    const dateFilterResult = getDateFilter(range, 'submittedAt');
    const dateFilterInterview = getDateFilter(range, 'completedAt');
    const dateFilterSubmission = getDateFilter(range, 'submittedAt');

    // Find all users who are NOT admins
    const nonAdminUsers = await User.find({ role: { $ne: 'admin' } }).select('_id');
    const nonAdminUserIds = nonAdminUsers.map(u => u._id);

    const scoreRanges = await Leaderboard.aggregate([
      { $match: { user: { $in: nonAdminUserIds } } },
      {
        $bucket: {
          groupBy: '$totalScore',
          boundaries: [0, 100, 300, 500, 1000, 5000],
          default: '5000+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const formattedRanges = scoreRanges.map(range => {
      let name = '';
      if (range._id === 0) name = '0-100';
      else if (range._id === 100) name = '100-300';
      else if (range._id === 300) name = '300-500';
      else if (range._id === 500) name = '500-1000';
      else if (range._id === 1000) name = '1000-5000';
      else name = '5000+';

      return { name, count: range.count };
    });

    const avgCategoryScores = await Result.aggregate([
      { $match: dateFilterResult },
      {
        $lookup: {
          from: 'tests',
          localField: 'test',
          foreignField: '_id',
          as: 'testDetails'
        }
      },
      { $unwind: '$testDetails' },
      {
        $lookup: {
          from: 'categories',
          localField: 'testDetails.category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: '$categoryDetails.name',
          categoryType: { $first: '$categoryDetails.type' },
          avgScore: { $avg: '$percentage' }
        }
      },
      {
        $project: {
          categoryName: '$_id',
          categoryType: 1,
          avgPercentage: { $round: ['$avgScore', 2] }
        }
      }
    ]);

    const topPerformers = await Leaderboard.find({ user: { $in: nonAdminUserIds } })
      .populate('user', 'name college branch year email')
      .sort({ totalScore: -1 })
      .limit(30);

    // Registration trend monthly (last 6 months)
    const registrationTrend = await User.aggregate([
      { $match: { role: 'student', ...dateFilterUser } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
          rawDate: { $min: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { rawDate: 1 } },
      { $limit: 6 }
    ]);

    // AI Mock Interview averages
    const interviewMetrics = await InterviewFeedback.aggregate([
      { $match: dateFilterInterview },
      {
        $group: {
          _id: null,
          avgOverall: { $avg: '$scores.overall' },
          avgCommunication: { $avg: '$scores.communication' },
          avgConfidence: { $avg: '$scores.confidence' },
          avgTechnical: { $avg: '$scores.technical' },
          totalInterviews: { $sum: 1 }
        }
      }
    ]);

    // Coding challenge status percentages
    const codingSolveRates = await CodingSubmission.aggregate([
      { $match: dateFilterSubmission },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Performance by branch
    const branchPerformance = await Result.aggregate([
      { $match: dateFilterResult },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.branch',
          avgScore: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $project: { branch: '$_id', avgPercentage: { $round: ['$avgScore', 2] }, count: 1 } },
      { $sort: { avgPercentage: -1 } }
    ]);

    return successResponse(res, 200, 'Student analytics retrieved', {
      performanceRanges: formattedRanges,
      averageScoresByCategory: avgCategoryScores,
      topPerformers,
      registrationTrend,
      interviewMetrics: interviewMetrics.length > 0 ? interviewMetrics[0] : { avgOverall: 0, avgCommunication: 0, avgConfidence: 0, avgTechnical: 0, totalInterviews: 0 },
      codingSolveRates,
      branchPerformance
    });
  } catch (error) {
    console.error('Get student analytics error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving student analytics');
  }
};

const getTestAnalytics = async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilterResult = getDateFilter(range, 'submittedAt');

    const testPerformance = await Result.aggregate([
      { $match: dateFilterResult },
      {
        $group: {
          _id: '$test',
          submissionsCount: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' },
          passedCount: {
            $sum: { $cond: [{ $eq: ['$passed', true] }, 1, 0] }
          },
          avgTotalMarks: { $avg: '$totalMarks' }
        }
      },
      {
        $lookup: {
          from: 'tests',
          localField: '_id',
          foreignField: '_id',
          as: 'testInfo'
        }
      },
      { $unwind: '$testInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'testInfo.category',
          foreignField: '_id',
          as: 'catInfo'
        }
      },
      { $unwind: { path: '$catInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          testName: '$testInfo.name',
          categoryName: '$catInfo.name',
          categoryType: '$catInfo.type',
          totalSubmissions: '$submissionsCount',
          averagePercentage: { $round: ['$avgPercentage', 2] },
          passRate: {
            $round: [
              { $multiply: [{ $divide: ['$passedCount', '$submissionsCount'] }, 100] },
              2
            ]
          },
          passingMarks: '$testInfo.passingMarks',
          totalMarks: { $ifNull: ['$avgTotalMarks', '$testInfo.totalQuestions'] }
        }
      },
      { $sort: { totalSubmissions: -1 } }
    ]);

    const testDifficultyCount = await Test.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    // Submissions Trend over time (daily, last 15 days)
    const submissionsTrend = await Result.aggregate([
      { $match: dateFilterResult },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 15 }
    ]);

    return successResponse(res, 200, 'Test analytics retrieved', {
      testPerformance,
      testDifficultyCount,
      submissionsTrend
    });
  } catch (error) {
    console.error('Get test analytics error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving test analytics');
  }
};

const getCategoryAnalytics = async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilterQuestion = getDateFilter(range, 'createdAt');
    const dateFilterTest = getDateFilter(range, 'createdAt');

    const questionsPerCategory = await Question.aggregate([
      { $match: { isActive: true, ...dateFilterQuestion } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'catInfo'
        }
      },
      { $unwind: '$catInfo' },
      {
        $project: {
          categoryName: '$catInfo.name',
          type: '$catInfo.type',
          count: 1
        }
      }
    ]);

    const testsPerCategory = await Test.aggregate([
      { $match: { isActive: true, ...dateFilterTest } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'catInfo'
        }
      },
      { $unwind: '$catInfo' },
      {
        $project: {
          categoryName: '$catInfo.name',
          type: '$catInfo.type',
          count: 1
        }
      }
    ]);

    return successResponse(res, 200, 'Category analytics retrieved', {
      questionsDistribution: questionsPerCategory,
      testsDistribution: testsPerCategory
    });
  } catch (error) {
    console.error('Get category analytics error:', error.message);
    return errorResponse(res, 500, 'Server error retrieving category analytics');
  }
};

module.exports = {
  getDashboardStats,
  getStudentAnalytics,
  getTestAnalytics,
  getCategoryAnalytics
};
