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
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请选择时间">
            </el-date-picker>
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
            :tableHead="orderTabHead"
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
  </div>
</template>
<script>
  import CustomTable from "@/components/CustomTable/index.vue"
  import CustomForm from "@/components/CustomForm/indexNew.vue"
  import { orderTabHead } from "./table.js";
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
        orderTabHead: orderTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 1,//主表分页page
        listQuery: {},
        mainButtons:{
            list:[
                {
                    label: "编辑",
                    type: "text",
                    size: "mini",
                    method: "edit",
                    if: () => {
                    return true;
                    },
                },
                {
                    label: "删除",
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
                label: '快递单号',
                type: 'input',
                maxlength: 20,
                formMaxWidth: 14,
            },
            {
                keyName: 'versionNum',
                label: '订单状态',
                type: 'switch',
                maxlength: 20,
                formMaxWidth: 14,
            },
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

      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


