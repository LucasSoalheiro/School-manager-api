import type { IGradeRepository, GradeWithDetails } from "../../repository/IGradeRepository.js";

type GetGradesByTeacherInput = {
  teacher_id: string;
};

export class GetGradesByTeacherService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: GetGradesByTeacherInput): Promise<GradeWithDetails[]> {
    return this.gradeRepository.findByTeacherId(input.teacher_id);
  }
}
