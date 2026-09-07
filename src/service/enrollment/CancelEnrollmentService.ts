import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";

type CancelEnrollmentInput = {
  enrollment_id: string;
};

export class CancelEnrollmentService {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(input: CancelEnrollmentInput): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(
      input.enrollment_id,
    );
    if (!enrollment) {
      throw new Error(
        `Enrollment with id "${input.enrollment_id}" not found`,
      );
    }

    enrollment.cancel();
    await this.enrollmentRepository.update(enrollment);
  }
}
