import StudentService from '../services/student.service.js';

export const getStudents = async (req, res, next) => {
  try {
    const result = await StudentService.getStudents(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await StudentService.getStudent(req.params.id);
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await StudentService.createStudent(req.body, req.file);
    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await StudentService.updateStudent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const result = await StudentService.deleteStudent(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const result = await StudentService.uploadAvatar(req.params.id, req.file);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
