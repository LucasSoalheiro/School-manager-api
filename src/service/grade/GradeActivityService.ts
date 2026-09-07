import type { IGradeRepository } from "../../repository/IGradeRepository.js";

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
      throw new Error(`Grade with id "${input.grade_id}" not found`);
    }

    grade.grade(input.score, input.feedback);
    await this.gradeRepository.update(grade);
  }
}
