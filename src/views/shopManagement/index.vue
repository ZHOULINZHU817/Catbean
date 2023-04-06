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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        size="mini"
        @click="handleAddShop"
        class="btn-add">添加
      </el-button>
    </el-card>
    <div class="table-container">
        <custom-table
            :tableData="viewTableData"
            :tableHead="shopTabHead"
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
            @switchChange="switchChange"
            ></custom-table>
    </div>
  </div>
</template>
<script>
  import {
    productList,
    productStatus
  } from "@/api/catApi/goodsApi";
  import CustomTable from "@/components/CustomTable/index.vue"
  import { shopTabHead } from "./table.js";
  export default {
    name: "orderList",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        shopTabHead: shopTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 5
        },
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
        activeName:'appointment'
      }
    },
    created() {
      this.productList();
    },
    // filters: {
    //   formatCreateTime(time) {
    //     let date = new Date(time);
    //     return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    //   },
    //   formatPayType(value) {
    //     if (value === 1) {
    //       return '支付宝';
    //     } else if (value === 2) {
    //       return '微信';
    //     } else {
    //       return '未支付';
    //     }
    //   },
    //   formatSourceType(value) {
    //     if (value === 1) {
    //       return 'APP订单';
    //     } else {
    //       return 'PC订单';
    //     }
    //   },
    //   formatStatus(value) {
    //     if (value === 1) {
    //       return '待发货';
    //     } else if (value === 2) {
    //       return '已发货';
    //     } else if (value === 3) {
    //       return '已完成';
    //     } else if (value === 4) {
    //       return '已关闭';
    //     } else if (value === 5) {
    //       return '无效订单';
    //     } else {
    //       return '待付款';
    //     }
    //   },
    // },
    methods: {
      productList(){
        productList(this.listQuery).then((res)=>{
           if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.total = total
           }
        })
      },
      doubleClick(){

      },
      getRowData(){

      },
      getSelection(){

      },
      sizeChange(val) {
        this.currentSize = val
        this.listQuery.size = this.currentSize
        this.productList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage
        this.productList()
      },
      handleResetSize() {
        this.currentPage = 1
        this.listQuery.page = this.currentPage
      },
      handleOperation(param) {
        console.log('param',param)
        switch(param.method){
          case 'edit':
            this.$router.push({ 
              path:'/shopManagement/shop/add',
              query:{
                  id: param.row.id
              }
            });
            break;
          case 'delete':
            this.goodDelete(param.row)
            break;
        }
      },
      handleAddShop() {
         this.$router.push(
           { 
                path:'/shopManagement/shop/add',
            }
        );
      },
      handleSearchList(){
        this.handleResetSize();
        this.productList()
      },
      handleResetSearch(){

      },
      switchChange(data){
        let params = {
          id: data.detail.row.id,
          status: data.detail.value
        }
        productStatus(params).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        })
      },
      goodDelete(data){
        let params = {
          id: data.id,
          status: 'delete'
        }
        productStatus(params).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
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


