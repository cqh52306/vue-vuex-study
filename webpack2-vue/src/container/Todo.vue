<template>
    <div class="todo-wrap">
        <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model.trim="todoText">
                <el-button @click="addTodo(todoText,this)" type="primary" :disabled="todoText == ''" slot="append">添加</el-button>
            </el-input>
        </div>
        <ul class="todoList">
            <li v-for="(todo, index) in todoList" class="todoItem">
                <el-button class="btn" @click="doneTodo(todo.id)" type="success" v-if="todo.isDone">{{todo.tips}}--</el-button>
                <el-button class="btn" @click="doneTodo(todo.id)" type="info" v-else>{{todo.tips}}--</el-button>
                <span :class="{ 'isDone': todo.isDone }">{{todo.text}}</span>
            </li>
        </ul>
    
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="0"></el-tab-pane>
            <el-tab-pane label="已完成" name="1"></el-tab-pane>
            <el-tab-pane label="未完成" name="2"></el-tab-pane>
        </el-tabs>
    
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
    mapMutaions,
    mapStates
} from 'vuex';

export default {
    data() {
        return {
            todoText: '',
            checked: false,
            activeName: '0'
        };
    },
    computed: {
        ...mapGetters([
            'todoList',
            'selected'
        ]),
    },
    methods: {
        ...mapActions([
            'addTodo',
            'doneTodo',
            'selectType'
        ]),
        handleClick() {
            this.selectType(this.activeName)
        }
    }
}
</script>

<style lang='scss' scoped>
.todo-wrap {
    width: 500px;
    padding-left: 200px;
    .todoList {
        width: 290px;
        min-height: 140px;
        margin: 40px auto;
        padding-left: 5px;
        padding-top: 5px;
        margin-top: 20px;
        margin-bottom: 50px;
        .todoItem {
            width: 95%;
            margin: 10px 0;
            border-bottom: 1px solid #b8b8bf;
            display: flex;
            align-items: center;
            .btn {
                margin-right: 20px;
            }
            .isDone {
                text-decoration: line-through;
            }
        }
    }
}
</style>
