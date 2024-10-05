import { Router } from "express";
import { Service } from "typedi";
// import { VerifyUser } from "../middleware/verifyUser";
import PlanService from "../service/plan.service";
import { ValidateCreatePlan } from "../schema/CreatePlan";
import { ValidateUpdatePlan } from "../schema/UpdatePlan";

@Service()
export default class PlanRouter {
  constructor(private readonly planService: PlanService) {}

  SetRouter(router: Router) {
    router.get("/plan/:planid", this.planService.GetPlanDetails);
    router.get("/plan", this.planService.GetPatientList);
    router.post("/plan", ValidateCreatePlan, this.planService.CreatePlan);
    router.put("/plan", ValidateUpdatePlan, this.planService.UpdatePlan);
  }
}
