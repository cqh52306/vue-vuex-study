<template>
    <div class="left-ct">
    
        <div style="color:#000;background:pink;height:36px;">通过路径匹配
            <br>{{$route.path}}</div>
    
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :unique-opened="true" router>
            <el-submenu :index="menu.id.toString()" v-for="menu in sysMenus">
                <template slot="title">
                    <i :class="menu.iconCls"></i>{{menu.name}}</template>
                <el-menu-item v-touch-ripple v-if="menu.children" :index="child.path.toString()" v-for="child in menu.children" :route="child">{{child.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters(['sysMenus'])
    },
    methods: {
        onRouteChange() {
            const HISTORY_ROUTES = sessionStorage.getItem("HISTORY_ROUTES");
            let routes = JSON.parse(HISTORY_ROUTES);
            this.sysMenus.forEach((menu) => {
                if (menu.children) {
                    menu.children.forEach((child) => {
                        var route = routes[child.name];
                        if (route) {
                            child.query = route.query;
                            child.params = route.params;
                        }

                    })
                }
            })
        }
    }
}


</script>


<style scoped >
.left-ct {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #1C2B36;
    color: #FFF;
}

.is-active {
    background: #32374a !important;
}

.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
.el-menu-item.is-active {
    color: #FFF;
}

.el-menu {
    border-top-width: 0;
}

.el-submenu.is-opened>.el-submenu__title {
    background-color: #32374a;
}

.el-submenu {
    background-color: #1C2B36;
    border: 1px solid transparent;
    -webkit-transition: border-color 0.4s ease;
    -o-transition: border-color 0.4s ease;
    transition: border-color 0.4s ease;
}

.el-menu-item,
.el-submenu__title {
    height: 40px;
    line-height: 40px;
    font-weight: bold;    
}

.el-submenu__title i.fa {
    width: 2em;
    font-size: 14px;
    display: inline-block;
}

.el-menu-item,
.el-submenu__title:hover {
    background-color: #32374a;
    color: #FFF;
}

.el-menu-item {
    color: #b4b6bd;
    background-color: #1C2B36;
    height: 41px !important;
    line-height: 41px !important;
}

.el-menu-item:hover {
    color: #FFF;
    background-color: #32374a !important;
}

</style>