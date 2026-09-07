import { Grade } from "../../entity/grade.js";
import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import type { IStudentRepository } from "../../repository/IStudentRepository.js";
import type { IActivityRepository } from "../../repository/IActivityRepository.js";

type AssignGradeInput = {
  student_id: string;
  activity_id: string;
};

type AssignGradeOutput = {
  grade_id: string;
  student_id: string;
  activity_id: string;
  status: string;
};

export class AssignGradeService {
  constructor(
    private readonly gradeRepository: IGradeRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(input: AssignGradeInput): Promise<AssignGradeOutput> {
    const student = await this.studentRepository.findById(input.student_id);
    if (!student) {
      throw new Error(`Student with id "${input.student_id}" not found`);
    }

    const activity = await this.activityRepository.findById(input.activity_id);
    if (!activity) {
      throw new Error(`Activity with id "${input.activity_id}" not found`);
    }

    const existing = await this.gradeRepository.findByStudentAndActivity(
      input.student_id,
      input.activity_id,
    );
    if (existing) {
      throw new Error(
        "A grade record already exists for this student and activity",
      );
    }

    const grade = Grade.create(student, activity);
    await this.gradeRepository.save(grade);

    return {
      grade_id: grade.id,
      student_id: grade.student_id,
      activity_id: grade.activity_id,
      status: grade.status,
    };
  }
}
