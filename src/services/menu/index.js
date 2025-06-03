const { MenuModel } = require("../../models");
const { ResponseHandler } = require("../../utils");

const Menu = new MenuModel();

class MenuService {

    static async provideGetAll() {
        const dataMenu = await Menu.findAll();
        const menuMap = {};

        dataMenu.forEach((menu) => {
            menuMap[menu.id] = {
                id: menu.id,
                name: menu.name,
                child: [],
            };
        });

        const formattedData = [];

        dataMenu.forEach((menu) => {
            if (menu.parent_id === 0) {
                formattedData.push(menuMap[menu.id]);
            } else {
                if (menuMap[menu.parent_id]) {
                    menuMap[menu.parent_id].child.push(menuMap[menu.id]);
                }
            }
        });

        formattedData.forEach((menu) => {
            menu.child.forEach((submenu) => {
                if (submenu.child.length === 0) {
                    delete submenu.child;
                }
            });
        });

        return formattedData;
    }

}

module.exports = MenuService;