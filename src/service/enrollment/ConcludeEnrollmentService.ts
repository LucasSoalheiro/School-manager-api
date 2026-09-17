import type { IEnrollmentRepository } from "../../repository/IEnrollmentRepository.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";

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
      throw new NotFoundError(
        `Enrollment with id "${input.enrollment_id}" not found`,
      );
    }

    try {
      enrollment.conclude();
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
    await this.enrollmentRepository.update(enrollment);
  }
}
