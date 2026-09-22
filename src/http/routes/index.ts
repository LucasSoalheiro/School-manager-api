import type { FastifyInstance } from "fastify";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

// Repositories
import { DrizzleStudentRepository } from "../../database/drizzle/repository/DrizzleStudentRepository.js";
import { DrizzleTeacherRepository } from "../../database/drizzle/repository/DrizzleTeacherRepository.js";
import { DrizzleSchoolClassRepository } from "../../database/drizzle/repository/DrizzleSchoolClassRepository.js";
import { DrizzleSubjectRepository } from "../../database/drizzle/repository/DrizzleSubjectRepository.js";
import { DrizzleEnrollmentRepository } from "../../database/drizzle/repository/DrizzleEnrollmentRepository.js";
import { DrizzleActivityRepository } from "../../database/drizzle/repository/DrizzleActivityRepository.js";
import { DrizzleGradeRepository } from "../../database/drizzle/repository/DrizzleGradeRepository.js";

// Services
import { RegisterStudentService } from "../../service/student/RegisterStudentService.js";
import { GetStudentByIdService } from "../../service/student/GetStudentByIdService.js";
import { UpdateStudentNameService } from "../../service/student/UpdateStudentNameService.js";
import { ChangeStudentPasswordService } from "../../service/student/ChangeStudentPasswordService.js";
import { ActivateStudentService } from "../../service/student/ActivateStudentService.js";
import { DeactivateStudentService } from "../../service/student/DeactivateStudentService.js";

import { RegisterTeacherService } from "../../service/teacher/RegisterTeacherService.js";
import { GetTeacherByIdService } from "../../service/teacher/GetTeacherByIdService.js";
import { UpdateTeacherNameService } from "../../service/teacher/UpdateTeacherNameService.js";
import { ChangeTeacherPasswordService } from "../../service/teacher/ChangeTeacherPasswordService.js";
import { AddClassToTeacherService } from "../../service/teacher/AddClassToTeacherService.js";
import { RemoveClassFromTeacherService } from "../../service/teacher/RemoveClassFromTeacherService.js";
import { DeactivateTeacherService } from "../../service/teacher/DeactivateTeacherService.js";

import { CreateSchoolClassService } from "../../service/school_class/CreateSchoolClassService.js";
import { GetSchoolClassByIdService } from "../../service/school_class/GetSchoolClassByIdService.js";
import { AddStudentToClassService } from "../../service/school_class/AddStudentToClassService.js";
import { RemoveStudentFromClassService } from "../../service/school_class/RemoveStudentFromClassService.js";
import { AddActivityToClassService } from "../../service/school_class/AddActivityToClassService.js";
import { CloseSchoolClassService } from "../../service/school_class/CloseSchoolClassService.js";
import { ReopenSchoolClassService } from "../../service/school_class/ReopenSchoolClassService.js";

import { CreateSubjectService } from "../../service/subject/CreateSubjectService.js";
import { UpdateSubjectService } from "../../service/subject/UpdateSubjectService.js";
import { GetSubjectsByClassService } from "../../service/subject/GetSubjectsByClassService.js";

import { CancelEnrollmentService } from "../../service/enrollment/CancelEnrollmentService.js";
import { ConcludeEnrollmentService } from "../../service/enrollment/ConcludeEnrollmentService.js";
import { GetEnrollmentsByStudentService } from "../../service/enrollment/GetEnrollmentsByStudentService.js";

import { GetActivityByIdService } from "../../service/activity/GetActivityByIdService.js";
import { UpdateDeliveryDateService } from "../../service/activity/UpdateDeliveryDateService.js";

import { AssignGradeService } from "../../service/grade/AssignGradeService.js";
import { SubmitGradeService } from "../../service/grade/SubmitGradeService.js";
import { GradeActivityService } from "../../service/grade/GradeActivityService.js";
import { GetGradesByStudentService } from "../../service/grade/GetGradesByStudentService.js";
import { GetGradesByActivityService } from "../../service/grade/GetGradesByActivityService.js";

// Controllers
import { AuthController } from "../controller/authController.js";
import { StudentController } from "../controller/studentController.js";
import { TeacherController } from "../controller/teacherController.js";
import { SchoolClassController } from "../controller/schoolClassController.js";
import { SubjectController } from "../controller/subjectController.js";
import { EnrollmentController } from "../controller/enrollmentController.js";
import { ActivityController } from "../controller/activityController.js";
import { GradeController } from "../controller/gradeController.js";

// Route Plugins
import { authRoutes } from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import { teacherRoutes } from "./teacherRoutes.js";
import { schoolClassRoutes } from "./schoolClassRoutes.js";
import { subjectRoutes } from "./subjectRoutes.js";
import { enrollmentRoutes } from "./enrollmentRoutes.js";
import { activityRoutes } from "./activityRoutes.js";
import { gradeRoutes } from "./gradeRoutes.js";

export async function registerRoutes(
  fastify: FastifyInstance,
  db: NeonHttpDatabase<any>,
): Promise<void> {
  // Repositories
  const studentRepo = new DrizzleStudentRepository(db);
  const teacherRepo = new DrizzleTeacherRepository(db);
  const schoolClassRepo = new DrizzleSchoolClassRepository(db);
  const subjectRepo = new DrizzleSubjectRepository(db);
  const enrollmentRepo = new DrizzleEnrollmentRepository(db);
  const activityRepo = new DrizzleActivityRepository(db);
  const gradeRepo = new DrizzleGradeRepository(db);

  // Controllers
  const authController = new AuthController(studentRepo, teacherRepo);

  const studentController = new StudentController(
    new RegisterStudentService(studentRepo),
    new GetStudentByIdService(studentRepo),
    new UpdateStudentNameService(studentRepo),
    new ChangeStudentPasswordService(studentRepo),
    new ActivateStudentService(studentRepo),
    new DeactivateStudentService(studentRepo),
  );

  const teacherController = new TeacherController(
    new RegisterTeacherService(teacherRepo),
    new GetTeacherByIdService(teacherRepo),
    new UpdateTeacherNameService(teacherRepo),
    new ChangeTeacherPasswordService(teacherRepo),
    new AddClassToTeacherService(teacherRepo, schoolClassRepo),
    new RemoveClassFromTeacherService(teacherRepo),
    new DeactivateTeacherService(teacherRepo),
  );

  const schoolClassController = new SchoolClassController(
    new CreateSchoolClassService(schoolClassRepo),
    new GetSchoolClassByIdService(schoolClassRepo),
    new AddStudentToClassService(schoolClassRepo, studentRepo, enrollmentRepo),
    new RemoveStudentFromClassService(schoolClassRepo, enrollmentRepo),
    new AddActivityToClassService(schoolClassRepo, activityRepo),
    new CloseSchoolClassService(schoolClassRepo),
    new ReopenSchoolClassService(schoolClassRepo),
  );

  const subjectController = new SubjectController(
    new CreateSubjectService(subjectRepo, teacherRepo, schoolClassRepo),
    new UpdateSubjectService(subjectRepo),
    new GetSubjectsByClassService(subjectRepo),
  );

  const enrollmentController = new EnrollmentController(
    new CancelEnrollmentService(enrollmentRepo),
    new ConcludeEnrollmentService(enrollmentRepo),
    new GetEnrollmentsByStudentService(enrollmentRepo),
  );

  const activityController = new ActivityController(
    new GetActivityByIdService(activityRepo),
    new UpdateDeliveryDateService(activityRepo),
  );

  const gradeController = new GradeController(
    new AssignGradeService(gradeRepo, studentRepo, activityRepo, enrollmentRepo),
    new SubmitGradeService(gradeRepo),
    new GradeActivityService(gradeRepo),
    new GetGradesByStudentService(gradeRepo),
    new GetGradesByActivityService(gradeRepo),
  );

  // Register route groups
  await fastify.register(authRoutes, {
    prefix: "/auth",
    controller: authController,
  });

  await fastify.register(studentRoutes, {
    prefix: "/students",
    controller: studentController,
  });

  await fastify.register(teacherRoutes, {
    prefix: "/teachers",
    controller: teacherController,
  });

  await fastify.register(schoolClassRoutes, {
    prefix: "/classes",
    controller: schoolClassController,
  });

  await fastify.register(subjectRoutes, {
    prefix: "/subjects",
    controller: subjectController,
  });

  await fastify.register(enrollmentRoutes, {
    prefix: "/enrollments",
    controller: enrollmentController,
  });

  await fastify.register(activityRoutes, {
    prefix: "/activities",
    controller: activityController,
  });

  await fastify.register(gradeRoutes, {
    prefix: "/grades",
    controller: gradeController,
  });
}
