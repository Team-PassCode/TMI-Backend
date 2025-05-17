import { Router } from 'express';
// import { VerifyUser } from "../middleware/verifyUser";
import PlanService from '../service/plan.service';
import { ValidateCreatePlan } from '../schema/CreatePlan';
import { ValidateUpdatePlan } from '../schema/UpdatePlan';
import { Controller } from '../decorator/controller';
import { ValidateCreatePlanReview } from '../schema/CreatePlanReview';

@Controller('/plan')
export default class PlanRouter {
  constructor(private readonly planService: PlanService) {}

  SetRouter(router: Router) {
    router.get('/:planid', this.planService.GetPlanDetails);
    router.get('/date/:date', this.planService.GetPlansOfSpecifiedDate);
    router.get('/', this.planService.GetPlanList);
    router.post('/', ValidateCreatePlan, this.planService.CreatePlan);
    router.put('/', ValidateUpdatePlan, this.planService.UpdatePlan);
    router.delete('/:planid', this.planService.DeletePlan);
    router.put(
      '/review',
      ValidateCreatePlanReview,
      this.planService.SavePlanReview
    );
    router.get('/predict/:date', this.planService.PredictPlan);
  }
}
