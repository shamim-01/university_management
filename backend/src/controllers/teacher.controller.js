import TeacherService from '../services/teacher.service.js';

export const getTeachers = async (req, res, next) => {
  try {
    console.log('📥 1. Controller: getTeachers called');
    console.log('📥 2. Query:', req.query);

    const result = await TeacherService.getTeachers(req.query);

    console.log('📥 3. Result teachers count:', result.teachers?.length);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('❌ Controller Error:', error);
    next(error);
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const teacher = await TeacherService.getTeacher(req.params.id);
    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const teacher = await TeacherService.createTeacher(req.body, req.file);
    res.status(201).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await TeacherService.updateTeacher(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const result = await TeacherService.deleteTeacher(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const assignCourse = async (req, res, next) => {
  try {
    const result = await TeacherService.assignCourse(
      req.params.id,
      req.body.courseId,
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCourse = async (req, res, next) => {
  try {
    const result = await TeacherService.removeCourse(
      req.params.id,
      req.params.courseId,
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
