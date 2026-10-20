import type { ISubjectRepository } from "../../repository/ISubjectRepository.js";
import type { Subject } from "../../entity/subject.js";
import { NotFoundError } from "../../errors/AppError.js";

type GetSubjectByIdInput = {
  id: string;
};

export class GetSubjectByIdService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(input: GetSubjectByIdInput): Promise<Subject> {
    const subject = await this.subjectRepository.findById(input.id);
    if (!subject) {
      throw new NotFoundError(`Subject with id "${input.id}" not found`);
    }
    return subject;
  }
}
