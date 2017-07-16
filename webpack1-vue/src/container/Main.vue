<template>
    <div class="main">
        <ZHHead/>
        <div>
            <div class="menu">
                <ZHMenu/>
            </div>
            <div class="content">
                <HistoryTab/>
                <router-view class="main-content-wrap"></router-view>
                <div class="copyright">Copyright</div>
            </div>
        </div>
    </div>
</template>


<script>
//引入组件
import ZHMenu from '../components/common/Menu'
import ZHHead from '../components/common/Header'
import HistoryTab from '../components/common/HistoryTab'
export default {
    name: 'main',
    data() {
        return {
        }
    },
    components: { ZHMenu, ZHHead, HistoryTab }//注册组件
}
</script>


<style>
.copyright {
    background-color: #FFF;
    text-align: center;
}

.main-content-wrap {
    /*border:1px solid red;*/
    flex: 1;
    overflow-y: auto;
    padding: 15px;
}

.main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.main .content {
    display: flex;
    overflow: hidden;
    flex-direction: column;
}

.main>div:first-child {
    height: 55px;
}

.main>div:last-child {
    flex: 1;
    display: flex;
    width: 100%;
}

.el-menu {
    border-top: 1px solid #DDD;
    width: 100%;
    background-color: #FFF;
}

.el-breadcrumb {
    font-size: 12px;
    line-height: 1;
    padding: 15px 10px;
    background-color: #FFF;
    border-bottom: 1px solid #DDD;
}

.el-menu+div {
    /*flex:1;*/
}

.menu+div {
    flex: 1;
    overflow-x: hidden;
    border: 1px solid #DDD;
    background-color: #f5f7fa;
    /*margin:5px 15px 0 15px;*/
}

.el-tabs {
    width: 100%;
}
</style>