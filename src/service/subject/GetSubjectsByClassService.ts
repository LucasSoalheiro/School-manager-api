import type { Subject } from "../../entity/subject.js";
import type { ISubjectRepository } from "../../repository/ISubjectRepository.js";

type GetSubjectsByClassInput = {
  class_id: string;
};

export class GetSubjectsByClassService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async execute(input: GetSubjectsByClassInput): Promise<Subject[]> {
    return this.subjectRepository.findByClassId(input.class_id);
  }
}
