import { Notification } from 'element-ui';
const todoPage = {
    state: {
        todoList: [],
        allTodoList: [],
        todoInfo: {
            id: 0,
            text: '',
            isDone: false,
            tips: ""
        },
        selected: 0
    },
    mutations: {
        ADD_TODO(state, todoText) {
            let bool = false;
            state.todoList.map((item) => {
                if (item.text == todoText) {
                    bool = true;
                    Notification.warning({
                        title: '提示信息',
                        message: "不允许添加相同名称",
                    });
                    return false;
                }
            });
            if (bool) {
                return false;
            }
            let num = state.todoList.length + 1;
            let item = {
                id: num,
                isDone: false,
                text: todoText,
                tips: "未完成"
            }
            state.todoList.push(item);
            //数据备份
            state.allTodoList.push(item);
        },
        DONE_TODO(state, id) {
            state.todoList.map((item) => {
                if (item.id == id) {
                    item.isDone = !item.isDone;
                    item.tips = item.isDone ? '已完成' : '未完成';
                }
            });
        },
        SELECT_TYPE(state, type) {
            if (type === '1') {
                state.todoList = state.allTodoList.filter((item) => {
                    if (item.isDone) {
                        return item;
                    }
                });

            } else if (type === '2') {
                state.todoList = state.allTodoList.filter((item) => {
                    if (!item.isDone) {
                        return item;
                    }
                });
            } else {
                state.todoList = state.allTodoList
            }
            state.selected = type;
        },
    },
    actions: {
        addTodo({ commit }, todoText) {
            commit('ADD_TODO', todoText);
        },
        doneTodo({ commit }, id) {
            commit('DONE_TODO', id);
        },
        selectType({ commit }, type) {
            commit('SELECT_TYPE', type);
        }
    },
    getters: {
        todoList: function (state) {
            return state.todoList
        },
        selected: function (state) {
            return state.selected
        }
    }
};

export default todoPage;
