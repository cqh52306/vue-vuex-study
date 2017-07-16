import routers from '../../routers/app.router'
//计算在数组中所处位置
function arrIndexOf(arr, item) {
    return arr.indexOf(item);
}

const system = {
    state: {
        loading: false,
        userInfo: {},
        menus: [{
            id: 90001,
            name: "配置管理",
            iconCls: "fa fa-plus",
            children: [{
                id: 90001001,
                path: '/system/user',
                name: "用户管理"
            }, {
                id: 90001004,
                path: '/system/mail',
                name: "邮件管理"
            }, {
                id: 90001008,
                path: '/system/todo',
                name: "todo"
            }]
        }],
        activeName: "首页",
        historyRoutes: sessionStorage.getItem('HISTORY_ROUTES') !== null ?
            JSON.parse(sessionStorage.getItem('HISTORY_ROUTES')) : {
                '11': {
                    id: 11,
                    name: "系统消息",
                    url: '',
                    iconCls: 'fa fa-plus',
                }
            }
    },
    mutations: {
        //开启遮罩
        MASK(state) {
            state.loading = true;
        },
        //关闭遮罩
        UNMASK(state) {
            state.loading = false;
        },
        //路由名字
        CHANGE_ACTIVE_ROUTE_NAME(state, name) {
            state.activeName = name;
        },
        //改变路由
        CHANGE_HiSTORY_ROUTES(state, routes) {
            state.historyRoutes = routes;
        },
    },
    actions: {
        addHistoryRoute: (store, route) => {
            let routes = JSON.parse(sessionStorage.getItem('HISTORY_ROUTES'));
            routes[route.name] = {
                name: route.name,
                path: route.path,
                query: route.query,
                params: route.params
            };
            sessionStorage.setItem('HISTORY_ROUTES', JSON.stringify(routes));
            store.commit('CHANGE_HiSTORY_ROUTES', routes);
            setTimeout(() => {
                store.commit('CHANGE_ACTIVE_ROUTE_NAME', route.name);
            }, 100)
        },
        deleteHistoryRoute: (store, route) => {
            let routes = JSON.parse(sessionStorage.getItem('HISTORY_ROUTES'));
            let historyKeys = Object.keys(routes);
            //当前光标所在位置
            let currTab = arrIndexOf(historyKeys, route.activeName);
            //当前点击的项
            let tapTab = arrIndexOf(historyKeys, route.key);
            delete routes[route.key];
            let keys = Object.keys(routes).length > 1 ? Object.keys(routes).length - 1 : 0;

            //光标位置与当前点击位置的判断
            //记录历史
            sessionStorage.setItem('HISTORY_ROUTES', JSON.stringify(routes));

            //点击当前光标左边的历史记录
            if (tapTab === currTab) {
                let historyKeysSec = Object.keys(routes);
                let indexSec = Object.keys(routes).length - 1;
                let keysSec = historyKeysSec[indexSec];
                route._this.$router.replace(routes[keysSec]);
                setTimeout(() => {
                    store.commit('CHANGE_ACTIVE_ROUTE_NAME', keysSec);
                }, 100)
            } else {
                store.commit('CHANGE_HiSTORY_ROUTES', routes);

                setTimeout(() => {
                    store.commit('CHANGE_ACTIVE_ROUTE_NAME', Object.keys(routes)[keys]);
                }, 100)
            }
        }
    },
    getters: {
        sysMenus(state) {
            return state.menus
        },
        routes(state) {
            var menuNamesMap = {};
            let newRouter = Object.assign({}, routers[0])
            newRouter.children = [];
            state.menus.forEach((menu) => {
                menuNamesMap[menu.name] = 1;
                let { children } = menu;
                if (children.length) {
                    children.forEach((child) => {
                        menuNamesMap[child.name] = 1;
                    })
                }
            })
            routers[0].children.forEach((router) => {
                if (router.name === '首页' || menuNamesMap[router.name]) {
                    let newRoute = Object.assign({ children: [] }, router)
                    if (router.children) {
                        router.children.forEach((child) => {
                            newRoute.children.push(child);
                        })
                    }
                    newRouter.children.push(newRoute);
                }
            })
            return [newRouter];
        },
        historyRoutes(state) {
            return state.historyRoutes
        },
        activeName(state) {
            return state.activeName;
        }
    }
};

export default system;