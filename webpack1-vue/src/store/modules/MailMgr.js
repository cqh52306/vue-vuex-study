require('es6-promise').polyfill();
require('isomorphic-fetch');

import routers from '../../routers/app.router'
import { Notification } from 'element-ui';

let mailListData = sessionStorage.getItem('MAIL') === null ? {
    pageTotal: 0,
    list: [
        {
            id: 0,
            status: 0,
            userName: '清华哥',
            content: 'vue2 vuex element ui',
            date: Date.now()
        }
    ]
} : JSON.parse(sessionStorage.getItem('MAIL'));

const mailMgr = {
    state: {
        mailList: mailListData
    },
    mutations: {
        FETCH_MAIL_LIST(state, value) {
            //添加进列表里
            let num = state.mailList.list.length + 1;
            let item = {
                id: num,
                status: value.status,
                userName: value.userName,
                content: value.content,
                date: Date.now(),
            }
            state.mailList.list.push(item);
            state.mailList.pageTotal = state.mailList.list.length;

            //本地存储
            window.sessionStorage.setItem('MAIL', JSON.stringify(state.mailList));
        },
        EDIT_MAIL(state, value) {
            //修改
            state.mailList.list.map(function (item, index) {
                if (item.id === value.id) {
                    state.mailList.list[index] = value
                }
            })
            //本地存储
            window.sessionStorage.setItem('MAIL', JSON.stringify(state.mailList));
        },
        SEARCH_LIST(state, value) {
            let listData = JSON.parse(sessionStorage.getItem('MAIL')).list;
            //状态
            if (value.status !== '') {
                let list = listData.filter((item) => {
                    return item.status == value.status
                })
                state.mailList.list = list;
            } else {
                state.mailList.list = listData;
            }
            //姓名
            if (value.userName !== '') {
                let list = state.mailList.list.filter((item) => {
                    return item.userName == value.userName
                })
                state.mailList.list = list;
            }

        },
        DELETE_MAIL(state, value) {
            //删除一条数据
            Array.prototype.diff = function (a) {
                return this.filter(function (i) { return a.indexOf(i) < 0; });
            };
            let result = state.mailList.list.diff(value)
            state.mailList.list = result;
            state.mailList.pageTotal = result.length;

            //本地存储
            window.sessionStorage.setItem('MAIL', JSON.stringify(state.mailList));
        }
    },
    actions: {
        fetchMailList: ({ commit }, query) => {
            //进入该页面请求列表数据
        },
        addMail({ commit, dispatch }, params) {
            //由actions拉起mutations
            commit('FETCH_MAIL_LIST', params);

            Notification.success({
                title: '提示信息',
                message: "添加成功",
            });
        },
        editMail({ commit, dispatch }, params) {
            commit('EDIT_MAIL', params);

            Notification.success({
                title: '提示信息',
                message: "添加成功",
            });
        },
        searchList({ commit, dispatch }, params) {
            commit('SEARCH_LIST', params);

            Notification.success({
                title: '提示信息',
                message: "搜索成功",
            });
        },
        deleteMail({ commit, dispatch }, params) {
            commit('DELETE_MAIL', params);

            Notification.success({
                title: '提示信息',
                message: "删除成功",
            });
        }
    },
    getters: {
        mailList(state) {
            return state.mailList;
        }
    }
};

export default mailMgr;