//css样式集合
import './utils/vendors';
//组件
import Vue from 'vue'
import VueRouter from 'vue-router';
import ElementUI from 'element-ui'
import TouchRipple from 'vue-touch-ripple'
import store from './store';
//方法
import { mapGetters, mapActions } from 'vuex';

//vue初始化注册组件
Vue.use(ElementUI);
Vue.use(TouchRipple);
Vue.use(VueRouter);

//sessionStorage初始化
function initSessionStorage() {
    sessionStorage.getItem('HISTORY_ROUTES') === null ? sessionStorage.setItem('HISTORY_ROUTES', JSON.stringify({
        '首页': {
            id: 11,
            name: "首页",
            url: '',
            iconCls: 'fa fa-plus',
        }
    })) : undefined;
}
initSessionStorage();

//routes初始化
let routes = store.getters['routes'];
const router = new VueRouter({ routes });

//vue初始化
var app = new Vue({
    store,
    router,
    computed: {
        loading: function () {
            return this.$store.state.system.loading//遮罩
        }
    },
    methods: {
        ...mapActions(['addHistoryRoute'])
    },
    watch: {
        '$route': function (route) {
            this.addHistoryRoute(route);//路由改变执行
        }
    }
}).$mount('#app');