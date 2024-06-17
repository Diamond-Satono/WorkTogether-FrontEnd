<template>
    <div>
        <div class="class1">
            <el-button
                @click="addDialog = true"
                type="primary"
                size="small"
                round
                icon="el-icon-edit"
            > 新增
            </el-button>
            <el-button
                @click="edit"
                type="primary"
                size="small"
                round
                icon="el-icon-edit"
            > 编辑
            </el-button>
        </div>
 
        <div>
            <el-table
                class="class2"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
                :data="tableData"
                :show-header="true"
                :background="true"
                border
                width="800px"
                tooltip-effect="light"
            >
                <el-table-column type="index" label="序号" width="100px">
                </el-table-column>
                <el-table-column label="姓名" prop="name" width="200px">
                </el-table-column>
                <el-table-column label="爱好" prop="stringHobby" width="500px">
                </el-table-column>
            </el-table>
 
            <el-dialog
                title="新增"
                :visible.sync="addDialog"
                :show-close="true"
                append-to-body
                width="30%"
                center
            >
                <div class="class3">
                    <el-form style="margin-left: 50px">
                        <el-form-item label="姓名：">
                            <el-input
                                v-model="formData.name"
                                style="width:400px; margin-left:-70px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="爱好：">
                            <el-select
                                v-model="formData.hobby"
                                multiple
                                style="width:400px;margin-left:-70px"
                            >
                                <el-option
                                      v-for="item in hobbyList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
 
                <div class="class3">
                    <el-button
                        @click="addSave"
                        type="primary"
                        size="small"
                        round
                        icon="el-icon-edit"
                    >
                    保存
                    </el-button>
                </div>
            </el-dialog>
 
            <el-dialog
                title="编辑"
                :visible.sync="editDialog"
                :show-close="true"
                append-to-body
                center
            >
                <el-table
                    :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }"
                    :data="editData"
                    :show-header="true"
                    :background="true"
                    stripe
                    border
                    tooltip-effect="light"
                >
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="爱好" prop="hobby">
                        <template slot-scope="{ row }">
                            <el-select v-model="row.hobby" multiple style="width:300px">
                                <el-option
                                    width="300px"
                                    v-for="item in hobbyList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
 
                <div class="class3">
                    <el-button
                        @click="editSave"
                        type="primary"
                        size="small"
                        round
                        icon="el-icon-edit"
                    >
                    保存
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
 
<script>
export default {
    data() {
        return {
            addDialog: false,
            editDialog: false,
            tableData: [],
            formData: [],
            editData: [],
            hobbyList: [
                { value: "1", label: "篮球" },
                { value: "2", label: "排球" },
                { value: "3", label: "足球" }
            ]
        };
    },
    mounted() {
        //进入主页面自动获取一次表格数据
        this.getData();
    },
    methods: {
        //获取主页表格数据
        getData() {
            axios({
                method: "post",
                url: "/dealData/showData",
                params: {}
            })
            .then(function(response) {
                this.tableData = response.data;
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        //获取编辑页面的表格数据
        edit() {
            this.editDialog = true;
            //将主表数据赋到编辑页面的表格数据中
            this.editData = this.tableData;
            //循环获取表格的每条记录
            for (let i = 0; i < this.editData.length; i++) {
                //以下代码的目的是将每条记录的爱好这一属性的类型由字符串转换为列表对象，如替换前为"1,2,3"，那么替换后为["1","2","3"]
                let str = this.editData[i].hobby.split("，");
                let newArray = [];
                //循环获取每条记录的爱好集合
                for (let j = 0; j < str.length; j++) {
                    newArray.push(str[j]);
                }
                this.editData[i].hobby = newArray;
            }
        },
        //新增记录时的保存方法
        addSave() {
            axios({
                method: "post",
                url: "/dealData/addData",
                params: { 'name': this.formData.name, 'hobby': this.formData.hobby }
            })
            .then(function(response) {
                console.log(response.data.message);
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        //编辑记录时的保存方法
        editSave() {
            var rows = [];
            var saveData = [];
            for (let i = 0; i < this.editData.length; i++) {
                var object = new Object();
                //获取当前记录的所有属性
                rows[i] = this.editData[i];
                object.name = rows[i].name;
                object.hobby = rows[i].hobby;
                saveData.push(object);
            }
            //将数据组合成一个列表对象(savaData)传给后端
            axios({
                method: "post",
                url: "/dealData/editData",
                params: savaData
            })
            .then(function(response) {
                this.$msgbox({
                    title: "系统提示",
                    message: response.data.message,
                    type: "success"
                });
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
}
</script>
 
<style scoped>
.class1 {
    margin-top: 50px;
    margin-bottom: 50px;
}
.class2 {
    width: 800px;
    margin: auto;
}
.class3 {
    margin-top: 50px;
    text-align: center;
}
</style>