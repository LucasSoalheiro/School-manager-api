import type { IGradeRepository } from "../../repository/IGradeRepository.js";

type SubmitGradeInput = {
  grade_id: string;
};

export class SubmitGradeService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: SubmitGradeInput): Promise<void> {
    const grade = await this.gradeRepository.findById(input.grade_id);
    if (!grade) {
      throw new Error(`Grade with id "${input.grade_id}" not found`);
    }

    grade.submit();
    await this.gradeRepository.update(grade);
  }
}
