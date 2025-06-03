const { ParameterModel, ProjectModel } = require("../../models");
const { ResponseHandler, CustomError } = require("../../utils");

const Parameter = new ParameterModel();
const Project = new ProjectModel();

class ParameterService {

    static async provideGetAll() {
        let data = await Parameter.findAll();
        data = data.map(item => {
            return {
                id: item.id,
                code: item.code,
                description: item.description,
                is_active: item.is_active,
                data: item.data,
                parent_parameter: item.parameter
            }
        })
        return data;
    }

    static async provideGetAllProjectType() {
        const data = await Parameter.findAllProjectType();
        return data;
    }

    static async provideGetAllProjectStatus() {
        let datas = await Parameter.findAllProjectStatusNoChild();
        datas = await Promise.all(
            datas.map(async item => {
                const parameterChild = await Parameter.findChildParamater(item.id);
                return {
                    id: item.id,
                    data: item.data,
                    description: item.description,
                    child: parameterChild.length > 0 ? parameterChild : []
                }
            })
        )

        return datas;
    }

    static async provideStore(bodyRequest) {
        const projectStatusCount = (await Parameter.findAllProjectStatus()).length;

        const inputRequest = {
            code: bodyRequest.code,
            description: bodyRequest.description,
            is_active: bodyRequest.is_active,
            data: bodyRequest.code === 'PROJECT_STATUS' ?
                projectStatusCount != 0 ? projectStatusCount : 0
                : bodyRequest.data,
            parameter: bodyRequest.parent_parameter
        }

        await Parameter.create(inputRequest);
    }

    static async provideUpdate(bodyRequest, parameterId) {
        const existedParameter = await Parameter.findById(parameterId);
        if (!existedParameter) { throw new CustomError('failed update data parameter, data not found', 400) }

        const projectStatusCount = (await Parameter.findAllProjectStatus()).length;

        const inputRequest = {
            param_id: parameterId,
            description: bodyRequest.description ?? existedParameter.description,
            is_active: bodyRequest.is_active ?? existedParameter.is_active,
            data: bodyRequest.code === 'PROJECT_STATUS' ? existedParameter.data : (bodyRequest.data ?? existedParameter.data),
            parameter: bodyRequest.parent_parameter ?? existedParameter.parameter
        }

        await Parameter.update(inputRequest);
    }

    static async provideDelete(parameterId) {
        const existedParameter = await Parameter.findById(parameterId);
        if (!existedParameter) { throw new CustomError('failed delete data parameter, data not found', 400) }

        const existedUsedProject = await Project.findByStatusData(existedParameter.data, false);
        if (existedUsedProject) { throw new CustomError('failed delete data, data is still reference to another relations', 400) }

        await Parameter.delete(parameterId);
    }
}

module.exports = ParameterService;