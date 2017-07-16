import Vue from 'vue';

//可要可不要
// const systemComponent = {
//     template: '<router-view></router-view>'
// }

const routes = [{
    path: '/',
    // name : 'base',
    component: resolve => {
        require.ensure(['../container/Main'], () => {
            resolve(require('../container/Main'))
        })
    },
    children: [{
        path: '',
        name: '首页',
        component: resolve => {
            require.ensure(['../container/Index'], () => {
                resolve(require('../container/Index'))
            })
        }
    }, {
        path: 'system/mail',
        name: '邮件管理',
        component: resolve => {
            require.ensure(['../container/MailMgr'], () => {
                resolve(require('../container/MailMgr'))
            })
        }
    }, {
        path: 'system/user',
        name: '用户管理',
        component: resolve => {
            require.ensure(['../container/UserMgr'], () => {
                resolve(require('../container/UserMgr'))
            })
        }
    }, {
        path: 'system/todo',
        name: 'todo',
        component: resolve => {
            require.ensure(['../container/Todo'], () => {
                resolve(require('../container/Todo'))
            })
        }
    }]

}]


export default routes;