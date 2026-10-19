import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type SubmitGradeInput = {
  grade_id: string;
  student_id: string;
};

export class SubmitGradeService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: SubmitGradeInput): Promise<void> {
    const grade = await this.gradeRepository.findById(input.grade_id);
    if (!grade) {
      throw new NotFoundError(`Grade with id "${input.grade_id}" not found`);
    }

    if (grade.student_id !== input.student_id) {
      throw new ForbiddenError("You can only submit your own grades");
    }

    try {
      grade.submit();
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.gradeRepository.update(grade);
  }
}
