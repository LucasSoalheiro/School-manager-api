import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetActivityByIdService } from "../../service/activity/GetActivityByIdService.js";
import type { UpdateDeliveryDateService } from "../../service/activity/UpdateDeliveryDateService.js";
import { updateDeliveryDateSchema } from "../schemas/activitySchemas.js";
import { uuidParamSchema } from "../schemas/studentSchemas.js";

export class ActivityController {
  constructor(
    private readonly getActivityByIdService: GetActivityByIdService,
    private readonly updateDeliveryDateService: UpdateDeliveryDateService,
  ) {}

  public getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const activity = await this.getActivityByIdService.execute({ id });
    reply.send({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      created_at: activity.created_at,
      delivery_date: activity.delivery_date,
      school_class_id: activity.school_class_id,
    });
  };

  public updateDeliveryDate = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = uuidParamSchema.parse(request.params);
    const { delivery_date } = updateDeliveryDateSchema.parse(request.body);
    await this.updateDeliveryDateService.execute({
      activity_id: id,
      new_delivery_date: delivery_date,
    });
    reply.send({ message: "Activity delivery date updated successfully" });
  };
}
