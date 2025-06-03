const express = require("express");
const router = express.Router();
const { SummaryModule } = require("../../modules");
const middleware = require("../../middleware");

router.get(
    "/api/v1/summary/assignment-progress",
    middleware.use('auth'),
    SummaryModule.assignmentProgress
);

router.get("/api/v1/summary/high-priority-projects", middleware.use('auth'), SummaryModule.getHighPriorityProject);

router.get(
    "/api/v1/summary/project-progress",
    middleware.use('auth'),
    SummaryModule.projectProgress
);

router.get("/api/v1/summary/milestone-projects", [middleware.use('auth')], SummaryModule.getMilestoneProjectList);

router.get("/api/v1/summary/implementation-projects", [middleware.use('auth')], SummaryModule.getImplementationSubs);

module.exports = router;
