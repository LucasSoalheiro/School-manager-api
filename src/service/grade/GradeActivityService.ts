import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type GradeActivityInput = {
  grade_id: string;
  /** Score from 0 to 10 */
  score: number;
  feedback?: string;
};

export class GradeActivityService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: GradeActivityInput): Promise<void> {
    const grade = await this.gradeRepository.findById(input.grade_id);
    if (!grade) {
      throw new NotFoundError(`Grade with id "${input.grade_id}" not found`);
    }

    try {
      grade.grade(input.score, input.feedback);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.gradeRepository.update(grade);
  }
}
