<template>
    <div class="history-tab">
        <el-tabs @tab-click="onTabClick" :active-name="activeName" type="card" editable @edit="handleTabsEdit">
            <el-tab-pane :key="route.name" v-for="(route, id) in historyRoutes" :route="route" :label="route.name" :name="route.name"></el-tab-pane>
        </el-tabs>
    </div>
</template>



<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['historyRoutes', 'activeName'])
    },
    methods: {
        ...mapActions([
            'deleteHistoryRoute'
        ]),
        'onTabClick': function (tab) {
            let route = this.historyRoutes[tab.name]
            this.$router.replace(route)
        },
        handleTabsEdit(targetName, action) {
            let route = {
                _this: this,
                key: targetName,
                activeName: this.activeName
            }
            this.deleteHistoryRoute(route);
        }
    }
}

</script>


<style>
.history-tab {
    background-color: #FFF;
}

.el-tabs__item {
    color: inherit;
}

.el-tabs__header {
    margin-bottom: 0;
}

.el-tabs__item:first-child {
    width: 62px;
    text-align: center;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.el-tabs__item:first-child .el-icon-close {
    display: none;
}

.el-tabs__new-tab {
    display: none;
}
</style>
