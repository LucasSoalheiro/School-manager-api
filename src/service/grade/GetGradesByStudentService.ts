import type { Grade } from "../../entity/grade.js";
import type { IGradeRepository } from "../../repository/IGradeRepository.js";

type GetGradesByStudentInput = {
  student_id: string;
};

export class GetGradesByStudentService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: GetGradesByStudentInput): Promise<Grade[]> {
    return this.gradeRepository.findByStudentId(input.student_id);
  }
}
