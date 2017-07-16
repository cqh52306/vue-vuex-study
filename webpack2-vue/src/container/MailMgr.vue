<template>
    <div>
        <el-dialog :title="userMessageTitle" v-model="dialogFormVisible">
            <el-form :model="userForm" ref="userForm" :rules="userFormRule">
                <el-form-item label="收件人" :label-width="formLabelWidth" prop="userName">
                    <el-input v-model="userForm.userName" :disabled="isChange" placeholder="请输入收件人" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="userForm.status" :disabled="isChange" placeholder="请选状态">
                        <el-option label="已发送" value="1"></el-option>
                        <el-option label="未发送" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发件内容" :label-width="formLabelWidth" prop="content">
                    <el-input type="textarea" :rows="3" :disabled="isChange" placeholder="请输入内容" v-model="userForm.content">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="ensureBtn">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 搜索区域 -->
        <el-form :model="searchForm" label-width="100px" class="search-form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="状态" prop="status">
                        <el-select size="small" v-model="searchForm.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已发送" value="1"></el-option>
                            <el-option label="未发送" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="userName">
                        <el-input size="small" v-model="searchForm.userName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center;padding:0 15px;" class="operation-ct">
                    <el-button @click="search" type="primary" size="small" icon="search">搜索</el-button>
                    <el-button @click="addMailMask" type="success" size="small" icon="fa fa-plus">添加</el-button>
                    <el-button @click="del" type="danger" size="small" icon="fa fa-plus" :disabled="delBtnDisabled">删除</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="mailList.list" border @selection-change="handleSelectionChange">
            <el-table-column fixed="left" type="selection" width="50">
            </el-table-column>
            <el-table-column fixed="left" prop="status" label="状态" width="150">
            </el-table-column>
            <el-table-column prop="userName" label="收件人" width="180">
            </el-table-column>
            <el-table-column prop="content" label="内容">
            </el-table-column>
            <el-table-column prop="date" label="发送时间" width="300">
            </el-table-column>
            <el-table-column inline-template fixed="right" label="操作" width="120">
                <span>
                    <el-button type="text" size="small" @click.native.prevent="view($index,'view',row)">查看</el-button>
                    <el-button type="text" size="small" @click.native.prevent="view($index,'edit',row)">编辑</el-button>
                </span>
            </el-table-column>
        </el-table>
    
        <el-pagination v-if="mailList.pageTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.curPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :layout="pagination.layout" :total="pagination.total">
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
            //搜素区域表单
            searchForm: {
                userName: "",
                status: ""
            },
            selections: [],
            userMessageTitle: '',
            dialogFormVisible: false,
            isEdit: false,
            isChange: false,
            //弹窗表单
            userForm: {
                userName: '',
                status: '',
                content: ''
            },
            formLabelWidth: '120px',
            userFormRule: {
                userName: [{
                    required: true,
                    message: '请输入收件人姓名',
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
                content: [{
                    required: true,
                    message: "请输入发件内容",
                    trigger: 'change'
                }]
            },
        };
    },
    computed: {
        ...mapGetters([
            'mailList'
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
                total: this.mailList.pageTotal,
                status: status,
                name: name
            }
        }
    },
    methods: {
        ...mapActions([
            'addMail',
            'editMail',
            'searchList',
            'deleteMail'
        ]),
        handleSelectionChange(selections) {
            this.selections = selections;
        },
        addMailMask() {
            //打开弹窗
            this.userMessageTitle = "新增邮件";
            this.isEdit = false;
            this.dialogFormVisible = true
        },
        //确定添加
        ensureBtn() {
            //验证必填项是否已填
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    //TODO
                    if (this.isEdit) {
                        //编辑
                        this.editMail(this.userForm)
                    } else {
                        this.addMail(this.userForm)
                    }
                    this.dialogFormVisible = false;
                } else {
                    alert('validate no pass')
                    return false;
                }
            });
        },
        //删除
        del() {
            this.$confirm('此操作将删除此用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // TODO 请求接口
                this.deleteMail(this.selections);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleSizeChange(size) {
            var { curPage, pageSize } = this.pagination;
            this.$router.push({
                name: "邮件管理", query: {
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
                name: "邮件管理", query: {
                    curPage: pageIndex,
                    times: Date.now(),
                    pageSize,
                    ...this.$data.params,
                }
            });
        },
        copyData: function (tarData) {
            var obj = {};
            obj = JSON.parse(JSON.stringify(tarData));
            return obj
        },
        view(index, str, row) {
            this.dialogFormVisible = true;
            this.userForm = {
                userName: '',
                status: 1,
                content: '',
            }
            //把字符串转化为数据
            this.userForm = this.copyData(row);
            console.log(this.userForm);
            if (str === "view") {
                this.isChange = true;
                this.userMessageTitle = "查看邮件";
            } else {
                this.isChange = false;
                this.isEdit = true;
                this.userMessageTitle = "编辑邮件";
            }
        },
        //搜索
        search() {
            this.searchList(this.searchForm)
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

.search-form {
    border: 1px solid #cfdbe2;
    border-top: 3px solid #cfdbe2;
    border-radius: 3px;
    background-color: #FFF;
    padding-top: 22px;
}

.operation-ct {
    padding-left: 20px;
}
</style>