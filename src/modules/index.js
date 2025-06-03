const AuthenticationModule = require("./authentication");
const UserModule = require("./user");
const GroupModule = require("./group");
const MenuModule = require("./menu");
const ProjectModule = require("./project");
const ParameterModule = require("./parameter");
const StatusModule = require("./status");
const ProjectStatusModule = require("./project-status");
const TasklistModule = require("./tasklist");
const SubtasklistModule = require("./subtasklist");
const FileHandlerModule = require("./file-handler");
const ProjectAssigneeModule = require("./project-assignee");
const CommentModule = require("./comment");
// const { testingModule } = require('./testing');
const SummaryModule = require("./summary");
const ReportTimeframeModule = require("./report-timeframe-project");
const ReportRewriteTaskModule = require("./report-rewrite-task");
const PurchaseOrderModule = require("./purchase-order");
const CustomerModule = require("./customer");
const ActivityLogModule = require("./activity-log");
const ReportUserTaskModule = require("./report-user-task");
const ReportActivityModule = require("./report-activity");
const DocsStandardModule = require("./docs-standard");

module.exports = {
  ActivityLogModule,
  AuthenticationModule,
  CustomerModule,
  MenuModule,
  UserModule,
  GroupModule,
  ProjectModule,
  ParameterModule,
  StatusModule,
  ProjectStatusModule,
  TasklistModule,
  SubtasklistModule,
  FileHandlerModule,
  ProjectAssigneeModule,
  CommentModule,
  // testingModule,
  SummaryModule,
  ReportTimeframeModule,
  ReportRewriteTaskModule,
  PurchaseOrderModule,
  ReportUserTaskModule,
  ReportActivityModule,
  DocsStandardModule,
  GoogleAuthModule: require('./google-auth')
};
