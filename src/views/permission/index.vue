<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.phone"
              class="input-width"
              placeholder="请输入用户名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        size="mini"
        class="btn-add"
        @click="handleAdd()"
        style="margin-left: 20px"
        >添加</el-button
      >
    </el-card> -->
    <div class="table-container">
      <el-table
        ref="roleTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="ID" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <!-- <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="mini"
                type="text"
                @click="handleSelectMenu(scope.$index, scope.row)"
                >分配菜单
              </el-button>
              <!-- <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button> -->
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.size"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="role.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->

    <el-dialog
      title="菜单权限"
      :visible.sync="menuPermissionVisible" 
      width="50%">
      <custom-form
        ref="subForm"
        :rules="rules"
        :form="form"
        :fields="fields"
        :form-ref="'subForm'"
        style="margin-bottom: 20px;padding-right:30px;padding-bottom: 100px;"
        :labelWidth="'80px'"
        :formMaxWidth="'dept'"
        class="shopCar"
    />
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuPermissionVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAdminList,
  getTreeList,
  getAssignPermissions,
  getHavePermissions
} from "@/api/login";
import { formatDate } from "@/utils/date";
import CustomForm from "@/components/CustomForm/indexNew.vue"

const defaultListQuery = {
  page: 1,
  size: 5,
  // keyword: null,
  phone: null
};
const defaultRole = {
  id: null,
  name: null,
  description: null,
  adminCount: 0,
  status: 1,
};
export default {
  name: "roleList",
  components:{
    CustomForm
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      isEdit: false,
      /***新参数**** */
      menuPermissionVisible: false,
      rules: {},
      form: {
        menuPermission:[]
      },
      fields:[
        {
            keyName: 'menuPermission',
            label: '菜单权限',
            type: 'checkbox',
            formMaxWidth: 24,
            list:[
             
            ]
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getTreeListData();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.page = 1;
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    // handleAdd() {
    //   this.dialogVisible = true;
    //   this.isEdit = false;
    //   this.role = Object.assign({}, defaultRole);
    // },
    // handleStatusChange(index, row) {
    //   this.$confirm("是否要修改该状态?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       updateStatus(row.id, { status: row.status }).then((response) => {
    //         this.$message({
    //           type: "success",
    //           message: "修改成功!",
    //         });
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消修改",
    //       });
    //       this.getList();
    //     });
    // },
    // handleDelete(index, row) {
    //   this.$confirm("是否要删除该角色?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     let ids = [];
    //     ids.push(row.id);
    //     let params = new URLSearchParams();
    //     params.append("ids", ids);
    //     deleteRole(params).then((response) => {
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //       this.getList();
    //     });
    //   });
    // },
    // handleUpdate(index, row) {
    //   this.dialogVisible = true;
    //   this.isEdit = true;
    //   this.role = Object.assign({}, row);
    // },
    // handleDialogConfirm() {
    //   this.$confirm("是否要确认?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     if (this.isEdit) {
    //       updateRole(this.role.id, this.role).then((response) => {
    //         this.$message({
    //           message: "修改成功！",
    //           type: "success",
    //         });
    //         this.dialogVisible = false;
    //         this.getList();
    //       });
    //     } else {
    //       createRole(this.role).then((response) => {
    //         this.$message({
    //           message: "添加成功！",
    //           type: "success",
    //         });
    //         this.dialogVisible = false;
    //         this.getList();
    //       });
    //     }
    //   });
    // },
    handleSelectMenu(index, row) {
      // this.$router.push({ path: "/ums/allocMenu", query: { roleId: row.id } });
      this.menuPermissionVisible = true;
      this.row = row;
      this.getHavePermissions(row.id);
    },
    handleSelectResource(index, row) {
      this.$router.push({
        path: "/ums/allocResource",
        query: { roleId: row.id },
      });
    },
    getList() {
      this.listLoading = true;
       const params = Object.assign({}, this.listQuery)
       params.page = params.page-1;
      getAdminList(params).then((response) => {
        this.listLoading = false;
        this.list = response.data.records;
        this.total = response.data.total;
      });
    },

    /**新街口** */
    handleConfirm() {
      this.menuPermissionVisible = false;
      getAssignPermissions(this.row.id, this.form.menuPermission).then(res=>{
        if(res.code == '200'){
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
        }
      })
    },
    /**菜单接口** */
    getTreeListData() {
      getTreeList().then((response) => {
        if(response.code == '200'){
           response.data.map(item=>{
            item.label = item.title;
            item.value = item.id;
           })
           this.$set(this.fields[0], 'list', response.data)
        }
      });
    },
    /**请求菜单权限** */
    getHavePermissions(id){
      getHavePermissions(id,{}).then(res=>{
        if(res.code == '200'){
          let data = res.data || [];
          this.$set(this.form, 'menuPermission', data)
        }
      })
    }
  },
};
</script>
<style></style>


