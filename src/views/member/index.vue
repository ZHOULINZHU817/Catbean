<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form ref="listQuery" :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item label="会员搜索：" prop="phone">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="请输入会员手机号"></el-input>
          </el-form-item>
           <el-form-item label="会员号：" prop="no">
            <el-input v-model="listQuery.no" class="input-width" placeholder="请输入会员号"></el-input>
          </el-form-item>
          <!-- <el-form-item label="时间：" v-if="isShowTime">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="timestamp"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
    <!-- <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        size="mini"
        @click="handleAddShop"
        class="btn-add">添加
      </el-button>
    </el-card> -->
    <div class="table-container">
        <el-tabs type="border-card" v-model="activeName"  @tab-click="handleTabClick">
          <el-tab-pane label="会员" name="member">
            <custom-table
                :tableData="viewTableData"
                :tableHead="memberTabHead"
                :isShowSelection="true"
                :sortable="true"
                :isShowPage="true"
                :currentSize="currentSize"
                :currentPage="currentPage"
                :buttonCellWidth="200"
                :height="'500'"
                :total="total"
                :rowEdit="true"
                :highlightCurrentRow="true"
                :buttons="mainButtons"
                @doubleClick="doubleClick"
                @getRowData="getRowData"
                @getSelection="getSelection"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
                @handleOperation="handleOperation"
            ></custom-table>
          </el-tab-pane>
          <el-tab-pane label="下级会员" name="juniorMember">
            <custom-table
                :tableData="viewTableData"
                :tableHead="memberTabHead"
                :isShowSelection="true"
                :sortable="true"
                :isShowPage="true"
                :currentSize="currentSize"
                :currentPage="currentPage"
                :buttonCellWidth="200"
                :height="'500'"
                :total="total"
                :rowEdit="true"
                :highlightCurrentRow="true"
                :buttons="mainButtons"
                @doubleClick="doubleClick"
                @getRowData="getRowData"
                @getSelection="getSelection"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
                @handleOperation="handleOperation"
            ></custom-table>
          </el-tab-pane>
        </el-tabs>
    </div>
    <el-dialog
      title="猫豆扣除"
      :visible.sync="dialogVisible" 
      width="50%">
      <custom-form
        ref="subForm"
        :label-width="'150px'"
        :rules="rules"
        :form="formInfo"
        :fields="fields"
        :form-ref="'subForm'"
        style="margin-bottom: 20px;padding-right:30px"
        :labelWidth="'150px'"
        :formMaxWidth="'dept'"
        class="shopCar"
    />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import CustomTable from "@/components/CustomTable/index.vue"
  import CustomForm from "@/components/CustomForm/indexNew.vue"
  import { memberTabHead } from "./table.js";
  import { memberList, managerFrozen, memberChildList, catReduce } from "@/api/catApi/memberApi"
  export default {
    name: "orderList",
    components:{
        CustomTable,
        CustomForm
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        memberTabHead: memberTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 10,
          // createTime:[]
        },
        mainButtons:{
            list:[
                {
                    label: "解封",
                    type: "text",
                    size: "mini",
                    method: "edit",
                    if: (param) => {
                      if(param.state == '冻结'){
                        return true;
                      }else{
                        return false;
                      }
                    },
                },
                {
                    label: "冻结",
                    type: "text",
                    size: "mini",
                    method: "delete",
                    class: "edit",
                    if: (param) => {
                       if(param.state == '正常'){
                          return true;
                        }else{
                          return false;
                        }
                    },
                },
                {
                    label: "猫豆扣除",
                    type: "text",
                    size: "mini",
                    method: "catDelete",
                    class: "edit",
                    if: (param) => {
                       return true;
                    },
                },
            ],
        },
        activeName: 'member',
        isShowTime: true,
        dialogVisible: false,
        formInfo: {},
        rules: {
            amount: [{
                required: true,
                message: '请输入扣除金额',
                trigger: 'blur'
            }]
        },
        fields: [
          {
              keyName: 'amount',
              label: '扣除金额',
              type: 'number',
              maxlength: 20,
              formMaxWidth: 24,
          },
        ],
        rowItem: {}
      }
    },
    created() {
      this.getMemberList();
    },
    methods: {
      doubleClick(){

      },
      getRowData(){

      },
      getSelection(){

      },
      sizeChange(val) {
        this.currentSize = val
        this.listQuery.size = this.currentSize
        if(this.activeName == 'member'){
          this.getMemberList();
        }else{
         if(this.listQuery.phone) this.getJuniorMember();
        }
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        if(this.activeName == 'member'){
          this.getMemberList();
        }else{
          if(this.listQuery.phone) this.getJuniorMember();
        }
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(params) {
        switch(params.method){
            case 'edit': //冻结
              this.getData(params.row, 1)   
            break;
            case 'delete': //解封
              this.getData(params.row, 2)   
            break; 
            case 'catDelete': //扣除
              this.dialogVisible = true;
              this.rowItem = params.row;
            break;
        }
      },
      getData(params, val) {
        let content = val == 1?'确认要解封该会员吗？': '确认要冻结该会员吗？';
        this.$confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              phone: params.phone,
              frozen: val == 1? false : true
            }
            managerFrozen(data).then(res=>{
              if(res.code == '200'){
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration: 1000
                });
                if(this.activeName == 'member'){
                  this.getMemberList();
                }else{
                  this.getJuniorMember();
                }
              }
            })
        })
      },
      getMemberList(){
        let params = {
            // begin: this.listQuery.createTime[0],
            // end: this.listQuery.createTime[1],
            page: this.listQuery.page,
            size: this.listQuery.size,
            phone: this.listQuery.phone,
            no: this.listQuery.no,
        }
        memberList(params).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data; 
            this.viewTableData = records || []; //[{status: false, phone:'123'},{status: true, phone:'456'}]
            this.viewTableData.map(item=>{
              item.state = item.status == 'normal' ? '正常':'冻结';
            })
            this.total = total
           }
        })
      },
      getJuniorMember(){
        let params = {
            page: this.listQuery.page,
            size: this.listQuery.size,
            phone: this.listQuery.phone,
        }
        memberChildList(params).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data; 
            this.viewTableData = records || []; //[{status: false, phone:'123'},{status: true, phone:'456'}]
            this.viewTableData.map(item=>{
              item.state = item.status == 'normal' ? '正常':'冻结';
            })
            this.total = total
           }
        })
      },
      handleSearchList(){
        this.handleResetSize();
        if(this.activeName == 'member'){
          this.getMemberList();
        }else{
          if(this.listQuery.phone) this.getJuniorMember()
        }
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      },
      handleTabClick(tab) {
        this.viewTableData = [];
        this.total = 0;
        this.handleResetSize();
        this.handleResetSearch();
        switch(tab.name){
          case 'member': //会员
            this.isShowTime = true;
            this.getMemberList();
            break;
          case 'juniorMember': //下级会员
            this.isShowTime = false;
            if(this.listQuery.phone) this.getJuniorMember();
            break;
        }
      },
      /**猫豆扣除** */
      handleConfirm(){
        this.$refs["subForm"].validate("", (boolean) => {
          if (boolean) {
            let params = {
              ...this.formInfo,
              phone: this.rowItem.phone
            }
            catReduce(params).then(res=>{
              if(res.code == '200'){
                this.$message({
                  message: '猫豆扣除成功',
                  type: 'success',
                  duration: 1000
                });
                this.dialogVisible = false;
                this.getMemberList();
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 220px;
  }
</style>


