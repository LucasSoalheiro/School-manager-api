import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";

type ConcludeEnrollmentInput = {
  enrollment_id: string;
};

export class ConcludeEnrollmentService {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(input: ConcludeEnrollmentInput): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(
      input.enrollment_id,
    );
    if (!enrollment) {
      throw new Error(
        `Enrollment with id "${input.enrollment_id}" not found`,
      );
    }

    enrollment.conclude();
    await this.enrollmentRepository.update(enrollment);
  }
}
