const authenticationRoutes = require("./authentication");
const usersRoutes = require("./user");
const groupsRoutes = require("./group");
const menusRoutes = require("./menu");
const projectsRoutes = require("./project");
const parametersRoutes = require("./parameter");
const statusRoutes = require("./status");
const projectStatusRoutes = require("./project-status");
const tasklistRoutes = require("./task");
const subtasklistRoutes = require("./subtask");
const fileHandlerRoutes = require("./file-handler");
const projectAssigneeRoutes = require("./project-assignee");
const commentsRoutes = require("./comment");
const testingRoutes = require("./testing");
const summaryRoutes = require("./summary");
const reportProjectRoutes = require("./report-timeframe-project");
const reportRewriteTask = require("./report-rewrite-task");
const purchaseOrderRoutes = require("./purchase-order");
const customerRoutes = require("./customer");
const activityLogRoutes = require("./activity-log");
const reportKpiRoutes = require("./report-user-task");
const reportActivity = require("./report-activity");
const docsStandardRoutes = require("./docs-standard");
const errorHandler = require("../middleware/errors");
const GoogleAuthRoutes = require('./google-auth');

const { GOOGLE_OAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CALLBACK_URL, GOOGLE_ACCESS_TOKEN_URL, GOOGLE_TOKEN_INFO_URL } = require("../config/env");
const fetch = require('node-fetch');

module.exports = (app) => {
  try {
    // Testing Routes
    app.get("/", async (req, res) => {
      return res.status(200).json({
        status: "success",
        message: "API service is run properly",
      });
    });

    // Authentication Routes
    app.use("/", authenticationRoutes);

    // Google Auth Routes
    app.use("/", GoogleAuthRoutes);
    
    // Users Routes
    app.use("/", usersRoutes);
    // Groups Routes
    app.use("/", groupsRoutes);
    // Menus Routes
    app.use("/", menusRoutes);
    // Projects Routes
    app.use("/", projectsRoutes);
    // Parameters Routes
    app.use("/", parametersRoutes);
    // Status Routes
    app.use("/", statusRoutes);
    // Project Status Routes
    app.use("/", projectStatusRoutes);
    // Tasklist Routes
    app.use("/", tasklistRoutes);
    // Subtasklist Routes
    app.use("/", subtasklistRoutes);
    // File Handling Routes
    app.use("/", fileHandlerRoutes);
    // Project Assignee Routes
    app.use("/", projectAssigneeRoutes);
    // Comments Routes
    app.use("/", commentsRoutes);
    // Testing Routes
    app.use("/", testingRoutes);
    // Summary Routes
    app.use("/", summaryRoutes);
    // Report Timeframe Project Routes
    app.use("/", reportProjectRoutes);
    // Report Rewrite Task Routes
    app.use("/", reportRewriteTask);
    // Purchase Order Routes
    app.use("/", purchaseOrderRoutes);
    // Customer Routes
    app.use("/", customerRoutes);
    // Activity Log Routes
    app.use("/", activityLogRoutes);

    app.use("/", reportKpiRoutes);

    app.use("/", reportActivity);

    app.use("/", docsStandardRoutes);

    app.use(errorHandler);

    // handle unknown routing
    app.get("*", (req, res) => {
      res.status(404).json({
        status: "error",
        message: "Route not found",
      });
    });
  } catch (error) {
    console.log("[INFO-SERVER]: Server error => ", error);
  }
};
