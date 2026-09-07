import type { Grade } from "../../entity/grade.js";
import type { IGradeRepository } from "../../repository/IGradeRepository.js";

type GetGradesByActivityInput = {
  activity_id: string;
};

export class GetGradesByActivityService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async execute(input: GetGradesByActivityInput): Promise<Grade[]> {
    return this.gradeRepository.findByActivityId(input.activity_id);
  }
}
