const { SummaryModel, ParameterModel, ProjectModel } = require("../../models");
const { ResponseHandler, CustomError, DateFormatter } = require("../../utils");
const jwtUtil = require("../../utils/jwtUtil");
const { CryptingTool } = require("../../utils/cryptingTool");

const Summary = new SummaryModel();
const Parameter = new ParameterModel();
const Project = new ProjectModel();

class SummaryService {
    static async provideGetMilestoneProjectList() {
        let datas = await Parameter.findAllProjectStatusNoChild();
        datas = await Promise.all(datas.map(async item => {
            let projects = await Summary.findAllProjectByStatus(item.data);
            projects = projects.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    status: item.status,
                    duration_Oncurrent_param: DateFormatter.formatDuration(item.duration),
                    startTime_Oncurrent_param: DateFormatter.formatDate(item.start_time_at_param)
                }
            })
            return {
                param_id: item.id,
                param_code: item.code,
                param_description: item.description,
                param_data: item.data,
                projects
            }
        }))

        return datas;
    }

    static async provideAssignmentProgress(assigneeId) {
        const data = await Summary.assignmentProgress(assigneeId);
        const response = this._formatTaskProgressData(data);
        return response;
    }

    static async provideProjectProgress() {
        const data = await Summary.projectProgress();
        const response = this._formatTaskProgressData(data);

        return response;
    }

    static async provideGetHighPriorityProject(assigneeId) {
        const highPrioProjects = await Summary.findHighPrioProjectByAssignee(assigneeId);
        const formattedProjects = highPrioProjects.map(item => ({
            id: item.id,
            project_name: item.project_name,
            start_date: item.start_date,
            end_date: item.end_date,
            status: item.status,
            assignee_team: item.assignee_team.join(',')
        }));

        return formattedProjects;
    }

    static async provideGetProjectsByParameterId() {
        const parameters = await Summary.getParameters();
        const projectsByParameter = await Promise.all(parameters.map(async (param) => {
            const projects = await Summary.getProjectsByParameterId(param.id);
            return {
                parameter_id: param.id,
                parameter_description: param.description,
                projects: projects
            };
        }));

        return projectsByParameter;
    }

    static async provideGetImplementationSubs() {
        let datas = await Summary.getImplementationSubdata();
        datas = await Promise.all(datas.map(async item => {
            let projects = await Summary.findAllProjectBySubStatus(item.data);
            projects = projects.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    status: item.status,
                    duration_Oncurrent_param: DateFormatter.formatDuration(item.duration),
                    startTime_Oncurrent_param: DateFormatter.formatDate(item.start_time_at_param)
                }
            });

            return {
                param_id: item.id,
                param_code: item.code,
                param_description: item.description,
                param_data: item.data,
                projects
            }
        }))

        return datas;
    }

    static _formatTaskProgressData(data) {
        return Object.values(
            data.reduce((acc, item) => {
                if (!acc[item.project_id]) {
                    acc[item.project_id] = {
                        project_id: item.project_id,
                        project_name: item.project_name,
                        statuses: []
                    };
                }
                acc[item.project_id].statuses.push({
                    status_id: item.status_id,
                    status_name: item.status_name,
                    percentage: item.percentage + "%"
                });
                return acc;
            }, {})
        );
    }
}
module.exports = SummaryService;