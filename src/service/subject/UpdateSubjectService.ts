import type { ISubjectRepository } from "../../repository/ISubjectRepository.js";

type UpdateSubjectInput = {
  id: string;
  name?: string;
  description?: string;
};

export class UpdateSubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(input: UpdateSubjectInput): Promise<void> {
    const subject = await this.subjectRepository.findById(input.id);
    if (!subject) {
      throw new Error(`Subject with id "${input.id}" not found`);
    }

    if (input.name !== undefined) {
      subject.update_name(input.name);
    }

    if (input.description !== undefined) {
      subject.update_description(input.description);
    }

    await this.subjectRepository.update(subject);
  }
}
