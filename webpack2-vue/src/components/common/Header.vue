<template>
    <div>
        <header class="common-header">
            <div class="logo">
                <img src="../../static/imgs/logo.png">
            </div>
            <div>
                <div>
    
                    <a v-touch-ripple>
                        <i class="fa fa-reorder"></i>
                    </a>
                </div>
                <div>
                    <a v-touch-ripple>
                        <i class="fa fa-user-circle-o"></i>
                    </a>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="im-icon-user1"></i>
                            {{username || ''}}
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="logout">
                                <i class="im-icon-edit dropdown-icon"></i>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </header>
    </div>
</template>


<script>
export default {
    data() {
        return {
            username: ''
        }
    },
    methods: {
        // 退出登录
        logout() {
            const self = this;
            self.$confirm('确认退出吗?', '提示').then(() => {
                sessionStorage.clear();
                self.handlerCloseWs = true;
                self.closeSocket();
                self.$router.push('/login');
            }).catch(() => { });
        }
    },
}


</script>



<style scoped >
.common-header {
    height: 55px;
    background-color: #1C2B36;
    /*background-color: #23b7e5;
    background-image: -webkit-linear-gradient(left, #20a0ff 0%, #097ac5 100%);
    background-image: -o-linear-gradient(left, #20a0ff 0%, #097ac5 100%);
    background-image: linear-gradient(to right, #20a0ff 0%, #097ac5 100%);
    background-repeat: repeat-x;*/
    color: #FFF;
    display: flex;
    align-items: center;
}

.common-header>:last-child {
    flex: 1;
    display: flex;
    font-size: 18px;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
}

.logo {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFF;
    width: 200px;
    text-align: center;
}

.logo img {
    vertical-align: middle;
    width: 151px;
    height: 26px;
}
</style>