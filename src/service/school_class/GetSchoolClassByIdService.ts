import type { School_class } from "../../entity/school_class.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";
import { NotFoundError } from "../../errors/AppError.js";

type GetSchoolClassByIdInput = {
  id: string;
};

export class GetSchoolClassByIdService {
  constructor(
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: GetSchoolClassByIdInput): Promise<School_class> {
    const school_class = await this.schoolClassRepository.findById(input.id);
    if (!school_class) {
      throw new NotFoundError(`Class with id "${input.id}" not found`);
    }
    return school_class;
  }
}
