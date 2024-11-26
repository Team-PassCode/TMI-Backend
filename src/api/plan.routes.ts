import { Router } from "express";
import { Service } from "typedi";
// import { VerifyUser } from "../middleware/verifyUser";
import PlanService from "../service/plan.service";
import { ValidateCreatePlan } from "../schema/CreatePlan";
import { ValidateUpdatePlan } from "../schema/UpdatePlan";
import { asyncHandler } from "../util/asyncErrorHandler";

@Service()
export default class PlanRouter {
  constructor(private readonly planService: PlanService) {}

  SetRouter(router: Router) {
    router.get("/plan/:planid", asyncHandler(this.planService.GetPlanDetails));
    router.get("/plan/date/:date", asyncHandler(this.planService.GetPlansOfSpecifiedDate));
    router.get("/plan", asyncHandler(this.planService.GetPlanList));
    router.post("/plan", ValidateCreatePlan, asyncHandler(this.planService.CreatePlan));
    router.put("/plan", ValidateUpdatePlan, asyncHandler(this.planService.UpdatePlan));
    router.delete("/plan/:planid", asyncHandler(this.planService.DeletePlan));
  }
}
