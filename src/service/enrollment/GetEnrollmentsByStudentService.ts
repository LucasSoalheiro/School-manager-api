import type { Enrollment } from "../../entity/enrollment.js";
import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";

type GetEnrollmentsByStudentInput = {
  student_id: string;
};

export class GetEnrollmentsByStudentService {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    input: GetEnrollmentsByStudentInput,
  ): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByStudentId(input.student_id);
  }
}
