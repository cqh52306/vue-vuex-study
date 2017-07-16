import Vue from 'vue';
import Vuex from 'vuex';
import plugins from './plugins';

import system from './modules/System';
import systemUser from './modules/system.user';
import todoPage from './modules/Todo';
import mailMgr from './modules/MailMgr';

Vue.use(Vuex);

//初始化store
export default new Vuex.Store({
    modules: {
        systemUser,
        system,
        todoPage,
        mailMgr
    },
    plugins
})