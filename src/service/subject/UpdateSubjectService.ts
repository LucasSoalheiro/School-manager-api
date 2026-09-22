import type { ISubjectRepository } from "../../repository/ISubjectRepository.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../errors/AppError.js";

type UpdateSubjectInput = {
  id: string;
  teacher_id: string;
  name?: string;
  description?: string;
};

export class UpdateSubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(input: UpdateSubjectInput): Promise<void> {
    const subject = await this.subjectRepository.findById(input.id);
    if (!subject) {
      throw new NotFoundError(`Subject with id "${input.id}" not found`);
    }

    if (subject.teacher_id !== input.teacher_id) {
      throw new ForbiddenError("You can only update your own subjects");
    }

    try {
      if (input.name !== undefined) {
        subject.update_name(input.name);
      }

      if (input.description !== undefined) {
        subject.update_description(input.description);
      }
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }

    await this.subjectRepository.update(subject);
  }
}
