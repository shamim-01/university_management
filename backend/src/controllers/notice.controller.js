import Notice from '../models/Notice.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
export const getNotices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, priority, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Check if notice is for user's role
    filter.targetAudience = { $in: ['all', req.user.role] };

    const notices = await Notice.find(filter)
      .populate('author', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ priority: 1, createdAt: -1 });

    const total = await Notice.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
export const getNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      'author',
      'name email',
    );

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    // Increment views
    notice.views += 1;
    await notice.save();

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private/Admin
export const createNotice = async (req, res, next) => {
  try {
    const noticeData = {
      ...req.body,
      author: req.user._id,
    };

    const notice = await Notice.create(noticeData);

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
export const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    await notice.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
