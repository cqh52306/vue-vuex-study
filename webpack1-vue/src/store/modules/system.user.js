require('es6-promise').polyfill();
require('isomorphic-fetch');
import routers from '../../routers/app.router'
import { Notification } from 'element-ui';

const systemUser = {
    state: {
        pageTotal: 0,
        systemUsersList: []
    },
    mutations: {
        SET_PAGE_TOTAL(state, value) {
            state.pageTotal = value;
        },
        FETCH_SYSTEM_USERS(state, value) {
            state.systemUsersList = value;
        }
    },
    actions: {
        fetchSystemUsers: ({ commit }, query) => {
            let params = {
                size: query.pageSize,
                page: query.curPage
            }
            if (query.name !== "") {
                params.name = query.name;
            }
            commit("MASK");
            fetch("api/list", {
                credentials: "include"
            }).then((res) => {
                return res.json();
            }).then((datas) => {
                //TODO
                commit('FETCH_SYSTEM_USERS', datas.list);
                let size = 60;
                commit('SET_PAGE_TOTAL', size);
                commit("UNMASK");
            }).catch((e) => {
                Notification.warning({
                    title: '提示信息',
                    message: "系统异常，获取数据失败",
                });
                console.log(e);
                commit("UNMASK");
            })
        },
        addUser({ commit, dispatch }, params) {
            let paramsDatas = {
                name: params.addingUser.no,
                rolers: params.addingUser.role
            }
            console.log(params);
            return fetch("/cfs-auth-server/user/addOrUpdate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(paramsDatas)
            })
                .then((res) => {
                    return res.json();
                })
                .then((datas) => {
                    if (datas.result === "OK") {
                        dispatch('reloadSystemUsers', params.routerDatas);
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        },
        deleteUser({ commit, dispatch }, params) {
            return fetch("/cfs-auth-server/user/deleteById", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "id=" + params.selectTions[0].id,
                credentials: "include"
            })
                .then((res) => {
                    return res.json();
                })
                .then((datas) => {
                    console.log("deleteUser--->", datas);
                    if (datas.result === "OK") {
                        dispatch('reloadSystemUsers', params.routerDatas);
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    },
    getters: {
        pageTotal(state) {
            return state.pageTotal;
        },
        systemUsersList(state) {
            return state.systemUsersList;
        }
    }
};

export default systemUser;