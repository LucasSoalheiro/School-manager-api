import { Subject } from "../../entity/subject.js";
import type { ISubjectRepository } from "../../repository/ISubjectRepository.js";
import type { ITeacherRepository } from "../../repository/ITeacherRepository.js";
import type { ISchoolClassRepository } from "../../repository/ISchoolClassRepository.js";

type CreateSubjectInput = {
  name: string;
  description: string;
  teacher_id: string;
  class_id: string;
};

type CreateSubjectOutput = {
  id: string;
  name: string;
  teacher_id: string;
  class_id: string;
};

export class CreateSubjectService {
  constructor(
    private readonly subjectRepository: ISubjectRepository,
    private readonly teacherRepository: ITeacherRepository,
    private readonly schoolClassRepository: ISchoolClassRepository,
  ) {}

  async execute(input: CreateSubjectInput): Promise<CreateSubjectOutput> {
    const teacher = await this.teacherRepository.findById(input.teacher_id);
    if (!teacher) {
      throw new Error(`Teacher with id "${input.teacher_id}" not found`);
    }

    const school_class = await this.schoolClassRepository.findById(
      input.class_id,
    );
    if (!school_class) {
      throw new Error(`Class with id "${input.class_id}" not found`);
    }

    const subject = Subject.create(
      input.name,
      input.description,
      teacher,
      school_class,
    );

    await this.subjectRepository.save(subject);

    return {
      id: subject.id,
      name: subject.name,
      teacher_id: subject.teacher_id,
      class_id: subject.school_class_id,
    };
  }
}
