import type { IGradeRepository } from "../../repository/IGradeRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type SubmitGradeInput = {
  grade_id: string;
};

export class SubmitGradeService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: SubmitGradeInput): Promise<void> {
    const grade = await this.gradeRepository.findById(input.grade_id);
    if (!grade) {
      throw new NotFoundError(`Grade with id "${input.grade_id}" not found`);
    }

    try {
      grade.submit();
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.gradeRepository.update(grade);
  }
}
