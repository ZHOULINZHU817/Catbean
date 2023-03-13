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
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="单据号"></el-input>
          </el-form-item>
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
        <custom-table
            :tableData="viewTableData"
            :tableHead="withdrawTabHead"
            :isShowSelection="true"
            :sortable="true"
            :isShowPage="true"
            :currentSize="currentSize"
            :currentPage="currentPage"
            :buttonCellWidth="200"
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
    </div>
    <el-dialog
      title="订单编辑"
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
    <el-dialog
      title="提现方式"
      :visible.sync="dialogVisibleNew" 
      width="50%">
         <div style="display:flex;">
            <div >微信提现:</div>
            <img style="width: 300px;height:300px;flex:1" src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg"/>
         </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleNew = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import CustomTable from "@/components/CustomTable/index.vue"
  import CustomForm from "@/components/CustomForm/indexNew.vue"
  import { withdrawTabHead } from "./table.js";
  export default {
    name: "orderList",
    components:{
        CustomTable,
        CustomForm
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [{oderCode:'13123131232'}],
        withdrawTabHead: withdrawTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 1,//主表分页page
        listQuery: {},
        mainButtons:{
            list:[
                {
                    label: "同意",
                    type: "text",
                    size: "mini",
                    method: "edit",
                    if: () => {
                    return true;
                    },
                },
                {
                    label: "拒绝",
                    type: "text",
                    size: "mini",
                    method: "delete",
                    class: "delete",
                    if: () => {
                    return true;
                    },
                },
            ],
        },
        dialogVisible: false,
        dialogVisibleNew: false,
        rules: {
            odercode: [{
                required: true,
                message: '请输入快递单号',
                trigger: 'blur'
            }]
        },
        formInfo: {
            odercode:'99999988'
        },
        fields: [
            {
                keyName: 'odercode',
                label: '原因',
                type: 'textarea',
                maxlength: 20,
                formMaxWidth: 24,
            }
        ]
      }
    },
    created() {
      
    },
    methods: {
      doubleClick(){

      },
      getRowData(){

      },
      getSelection(){

      },
      sizeChange() {

      },
      currentChange() {

      },
      handleOperation(params) {
        switch(params.method){
            case 'edit':
            this.dialogVisibleNew = true;
            break;
            case 'delete':
             this.dialogVisible = true;
            break;
        }
        console.log('params', params)
      },
      handleAddShop() {
         this.$router.push(
           { 
                path:'/shopManagement/shop/add',
                query:{
                    id:''
                }
            }
        );
      },
      handleConfirm(){

      },
      handleConfirmSave(){

      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


