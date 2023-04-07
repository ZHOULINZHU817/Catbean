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
        <el-form ref="listQuery" :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：" prop="memberPhone">
            <el-input v-model="listQuery.memberPhone" class="input-width" placeholder="请输入会员手机号"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
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
            :height="'400'"
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
  import {
   productOrderList,
   productOrderSend
  } from "@/api/catApi/goodsApi";
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
        orderTabHead: orderTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 5,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 5,
          createTime:[new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 3600 * 1000, new Date(new Date().toLocaleDateString()).getTime()]
        },
        mainButtons:{
            list:[
                {
                    label: "发货",
                    type: "text",
                    size: "mini",
                    method: "edit",
                    if: () => {
                    return true;
                    },
                }
            ],
        },
        dialogVisible: false,
        rules: {
            logisticsNo: [{
                required: true,
                message: '请输入快递单号',
                trigger: 'blur'
            }]
        },
        formInfo: {
            logisticsNo:''
        },
        fields: [
            {
                keyName: 'logisticsNo',
                label: '快递单号',
                type: 'input',
                maxlength: 20,
                formMaxWidth: 14,
            },
            // {
            //     keyName: 'versionNum',
            //     label: '订单状态',
            //     type: 'switch',
            //     maxlength: 20,
            //     formMaxWidth: 14,
            // },
        ]
      }
    },
    created() {
      this.getProductOrderList();
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
        this.getProductOrderList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        this.getProductOrderList()
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(params) {
        this.row = params.row;
        switch(params.method){
            case 'edit':
                this.dialogVisible = true;
            break;
        }
        console.log('params', params)
      },
      // handleAddShop() {
      //    this.$router.push(
      //      { 
      //           path:'/shopManagement/shop/add',
      //           query:{
      //               id:''
      //           }
      //       }
      //   );
      // },
      handleConfirm(){
        this.$refs["subForm"].validate("", (boolean) => {
          if (boolean) {
            let params = {
              id:this.row.id,
              ...this.formInfo
            }
            productOrderSend(params).then(res=>{
              if(res.code == '200'){
                this.$message({
                  message: '发货成功！',
                  type: 'success',
                  duration: 1000
                });
                this.dialogVisible = false;
                this.getProductOrderList();
              }
            })
          }
        })
      },
      handleSearchList(){
        this.handleResetSize();
        this.getProductOrderList()
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      },
      //列表
      getProductOrderList(){
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[0],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
        }
        productOrderList(params).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.total = total
           }
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


