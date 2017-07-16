<template>
    <div>
        <!--新增&&查看&&编辑-->
        <el-dialog @close="cancelDialog" :title="userMessageTitle" v-model="dialogUserMessage">
            <el-form :model="addNewUserForm" ref="changeUserMessageForm" :rules="addNewUserFormRule" label-position="right">
                <el-form-item label="用户帐号" :label-width="formLabelWidth" prop="userName">
                    <el-input v-model="addNewUserForm.userName" placeholder="请输入用户账号" auto-complete="off" :disabled="isChange"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
                    <el-radio class="radio" v-model="addNewUserForm.status" :label="1" :disabled="isChange">开启</el-radio>
                    <el-radio class="radio" v-model="addNewUserForm.status" :label="0" :disabled="isChange">禁用</el-radio>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
                    <el-checkbox-group v-model="addNewUserForm.role">
                        <el-checkbox v-for="role in rolesList" :label="role" :key="role" :disabled="isChange">{{role}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="cancelDialog">取 消</el-button>
                <el-button type="warn" v-if="!isChange" @click="resetChangeUserForm">重置</el-button>
                <el-button type="primary" v-if="!isChange" @click="addNewUser">确 定</el-button>
            </div>
        </el-dialog>
        <!--搜索区-->
        <el-form v-model="params" label-width="100px" class="params-form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="状态" prop="status">
                        <el-select size="small" v-model="params.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                        <el-input size="small" v-model="params.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center;padding:0 15px;" class="operation-ct">
                    <el-button type="primary" size="small" @click="search" icon="search">搜索</el-button>
                    <el-button @click="addUsers" type="success" size="small" icon="fa fa-plus">添加</el-button>
                    <el-button @click="delUsers" type="danger" size="small" icon="fa fa-plus" :disabled="delBtnDisabled">删除</el-button>
                </el-col>
            </el-row>
        </el-form>
    
        <!--列表-->
        <el-table :data="systemUsersList" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="status" label="状态" :filters="[{ text: '启用', value: '1' }, { text: '禁用', value: '0' }]" inline-template :filter-method="filterTag" sortable width="120">
                <el-tag :type="row.status==0?'danger':'primary'" close-transition>{{row.status==0?"禁用":"启用"}}</el-tag>
            </el-table-column>
            <el-table-column sortable prop="userName" label="名称" width="120"></el-table-column>
            <el-table-column sortable prop="role" label="角色">
            </el-table-column>
            <el-table-column inline-template fixed="right" label="操作" width="120">
                <span>
                    <el-button type="text" size="small" @click.native.prevent="viewUser($index,'view',row)">查看</el-button>
                    <el-button type="text" size="small" @click.native.prevent="viewUser($index,'edit',row)">编辑</el-button>
                </span>
            </el-table-column>
    
        </el-table>
    
        <el-pagination v-if="pageTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.curPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :layout="pagination.layout" :total="pagination.total">
        </el-pagination>
    </div>
</template>


<script>
//在页面使用需要导入vuex提供的这四个函数
import {
    mapGetters,
    mapActions,
    mapMutaions,
    mapStates
} from 'vuex';
export default {
    data() {
        return {
            rolesList: ['系统管理员', '前端开发工程师', '最强王者', '程序员鼓励师'],
            params: {
                name: "",
                status: ""
            },
            selections: [],
            addNewUserForm: {
                name: '',
                status: 1,
                role: []
            },
            formLabelWidth: '85px',
            addNewUserFormRule: {
                userName: [{
                    required: true,
                    message: '请输入用户名称',
                    trigger: 'change'
                }, {
                    min: 1,
                    max: 8,
                    message: '用户账号长度应在 1 到 8 个字符',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: "请选择是否启用",
                }],
                role: [{
                    required: true,
                    message: "请选中当前用户的角色",
                }]
            },
            dialogUserMessage: false,
            isChange: false,
            userMessageTitle: "",
        };
    },
    computed: {
        ...mapGetters([
            'systemUsersList',
            'pageTotal'
        ]),
        delBtnDisabled: function () {
            return this.selections.length === 0;
        },
        pagination: function () {
            let { curPage, pageSize, status, name } = this.$route.query;
            return {
                curPage: curPage ? parseInt(curPage) : 1,
                pageSizes: [10, 20, 30, 40],
                pageSize: pageSize ? parseInt(pageSize) : 10,
                layout: "total, sizes, prev, pager, next, jumper",
                total: this.pageTotal,
                status: status,
                name: name
            }
        },
    },
    created: function () {
        this.fetchSystemUsers(this.pagination);
    },
    watch: {
        '$route': 'routChange' // 如果路由有变化，会再次执行该方法
    },
    methods: {
        ...mapActions([
            'fetchSystemUsers',
            'addUser',
            'deleteUser'
        ]),
        filterTag(value, row) {
            return row.status === parseInt(value);
        },
        search() {
            var { curPage, pageSize } = this.pagination;
            //触发路由改变
            this.$router.push({
                name: "用户管理",
                query: {
                    curPage: 1,
                    times: Date.now(),
                    pageSize,
                    ...this.$data.params
                }
            });
        },
        handleSelectionChange(selections) {
            this.selections = selections;
        },
        routChange({ params, query }) {
            this.fetchSystemUsers(query);
        },
        handleSizeChange(size) {
            var { curPage, pageSize } = this.pagination;
            this.$router.push({
                name: "用户管理", query: {
                    curPage: 1,
                    times: Date.now(),
                    pageSize,
                    ...this.$data.params,

                }
            });
        },
        handleCurrentChange(pageIndex) {
            let { curPage, pageSize } = this.pagination;
            this.$router.push({
                name: "用户管理", query: {
                    curPage: pageIndex,
                    times: Date.now(),
                    pageSize,
                    ...this.$data.params,
                }
            });

        },
        //清空弹窗信息
        emptyDialog() {
            this.addNewUserForm = {
                name: '',
                status: 1,
                role: [],
            }
        },
        //关闭弹窗
        cancelDialog() {
            this.dialogUserMessage = false;
            this.emptyDialog();
        },
        // 删除
        delUsers() {
            this.$confirm('此操作将删除此用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定就去请求接口
                let params = {
                    selectTions: this.selections,
                    routerDatas: this.pagination
                }
                this.deleteUser(params);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addUsers() {
            //打开弹窗
            console.log(this.addNewUserForm, 222)
            this.dialogUserMessage = true;
            this.emptyDialog();
            this.isChange = false;
            this.userMessageTitle = "新增用户";
        },
        viewUser(index, str, row) {
            this.dialogUserMessage = true;
            this.emptyDialog();
            //把字符串转化为数据
            row.role = Array.isArray(row.role) ? row.role : row.role.split(",");
            this.addNewUserForm = row;
            console.log(this.addNewUserForm);
            if (str === "view") {
                this.isChange = true;
                this.userMessageTitle = "查看用户信息";
            } else {
                this.isChange = false;
                this.userMessageTitle = "修改用户信息";
            }
        },
        addNewUser() {
            this.$refs.changeUserMessageForm.validate((valid) => {
                if (valid) {
                    alert(JSON.stringify(this.$data.addNewUserForm));
                    //TODO ajax action to add User
                } else {
                    alert('validate no pass')
                    return false;
                }
            });
        },
        // 重置
        resetChangeUserForm() {
            this.$refs.changeUserMessageForm.resetFields();
        }
    }
}
</script>


<style lang='scss' scoped>
.el-table {
    margin-top: 15px;
}

.el-pagination {
    text-align: right;
    padding: 15px 0;
}

.params-form {
    border: 1px solid #cfdbe2;
    border-top: 3px solid #cfdbe2;
    border-radius: 3px;
    background-color: #FFF;
    padding-top: 22px;
    /*border: 1px solid red;*/
}

.operation-ct {
    padding-left: 20px;
}
</style>