import { School_class } from "../../entity/school_class.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";

type CreateSchoolClassInput = {
  class_name: string;
  teacher_id: string;
};

type CreateSchoolClassOutput = {
  id: string;
  class_name: string;
  teacher_id: string;
};

export class CreateSchoolClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(
    input: CreateSchoolClassInput,
  ): Promise<CreateSchoolClassOutput> {
    const school_class = School_class.create(input.class_name, input.teacher_id);
    await this.schoolClassRepository.save(school_class);
    return {
      id: school_class.id,
      class_name: school_class.class_name,
      teacher_id: school_class.teacher_id!,
    };
  }
}
