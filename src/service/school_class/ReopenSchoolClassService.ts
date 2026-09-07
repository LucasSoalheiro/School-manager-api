import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";

type ReopenSchoolClassInput = {
  id: string;
};

export class ReopenSchoolClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: ReopenSchoolClassInput): Promise<void> {
    const school_class = await this.schoolClassRepository.findById(input.id);
    if (!school_class) {
      throw new Error(`Class with id "${input.id}" not found`);
    }
    if (school_class.is_active) {
      throw new Error("Class is already open");
    }

    school_class.reopen();
    await this.schoolClassRepository.update(school_class);
  }
}
