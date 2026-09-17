import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

type CloseSchoolClassInput = {
  id: string;
};

export class CloseSchoolClassService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: CloseSchoolClassInput): Promise<void> {
    const school_class = await this.schoolClassRepository.findById(input.id);
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.id}" not found`);
    }
    if (!school_class.is_active) {
      throw new BadRequestError("Class is already closed");
    }

    school_class.close();
    await this.schoolClassRepository.update(school_class);
  }
}
