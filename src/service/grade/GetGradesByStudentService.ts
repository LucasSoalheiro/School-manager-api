import type { IGradeRepository, GradeWithDetails } from "../../repository/IGradeRepository.js";

type GetGradesByStudentInput = {
  student_id: string;
};

export class GetGradesByStudentService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: GetGradesByStudentInput): Promise<GradeWithDetails[]> {
    return this.gradeRepository.findByStudentIdWithDetails(input.student_id);
  }
}
