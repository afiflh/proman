const { ProjectStatusModel, ProjectModel } = require("../../../models");

const projectStatus = new ProjectStatusModel();
const project = new ProjectModel();

async function getSequenceProjectStatus(project_id) {
    const existedProject = await project.findById(project_id);
    if (existedProject === null) {
        return new Error('error get sequence project status by project id, project not found');
    }

    let status = await projectStatus.findStatusByProject(project_id);
    let statusArray = status.project_status.split(',');

    let sequenceStatusArray = [];
    let increment = 1;
    for (let index = 0; index < statusArray.length; index++) {
        sequenceStatusArray.push({
            order_index: increment,
            status: statusArray[index]
        })

        increment++;
    }

    return sequenceStatusArray
}

module.exports = {
    getSequenceProjectStatus
}