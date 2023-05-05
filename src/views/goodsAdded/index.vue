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
        <el-form ref="listQuery" :inline="true" :model="listQuery" size="small" label-width="140px" @submit.native.prevent>
          <el-form-item label="场次搜索：" prop="type">
            <!-- <el-input v-model="listQuery.type" class="input-width" placeholder="请输入场次" @keyup.enter.native="handleSearchList()"></el-input> -->
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width" style="width: 220px;">
                <el-option v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="提交时间：">
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
          </el-form-item> -->
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
            :tableHead="addedTabHead"
            :isShowSelection="false"
            :sortable="true"
            :isShowSeq="true"
            :isShowPage="true"
            :currentSize="currentSize"
            :currentPage="currentPage"
            :buttonCellWidth="200"
            :total="total"
            :rowEdit="true"
            :highlightCurrentRow="true"
            :height="'400'"
            :buttons="mainButtons"
            @doubleClick="doubleClick"
            @getRowData="getRowData"
            @getSelection="getSelection"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
            @handleOperation="handleOperation"
            ></custom-table>
    </div>
  </div>
</template>
<script>
  import {
    saleOrderList
  } from "@/api/catApi/addedOrderApi";
  import CustomTable from "@/components/CustomTable/index.vue"
  import { addedTabHead } from "./table.js";
  let typeList = {
    twelve:'12：00场',
    sixteen:'16：00场',
    twenty:'20：00场'
  }

  let statusList = {
    un_allocate:'待分配',
    allocated:'已分配',
    miss:'已流拍',
    breach:'已违约',
    finish:'已完成'
  }
  export default {
    name: "addedList",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [], //{price: 1, startBuyTime:"2023-04-07 12:23:26",type:"twelve", id:'1'}
        addedTabHead: addedTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 10
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
                // {
                //     label: "删除",
                //     type: "text",
                //     size: "mini",
                //     method: "delete",
                //     class: "delete",
                //     if: () => {
                //     return true;
                //     },
                // },
            ],
        },
        activeName:'appointment',
        statusOptions:[
            {label:"12：00场",value:'twelve'},
            {label:"16：00场",value:'sixteen'},
            {label:"20：00场",value:'twenty'}
        ],
      }
    },
    created() {
      this.saleOrderList();
    },
    methods: {
      saleOrderList(){
        saleOrderList(this.listQuery).then((res)=>{
           if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.viewTableData.map(item=>{
              item.type = typeList[item.type];
              item.state = statusList[item.status];
              item.memberName = item.member && item.member.nickName;
              item.memberPhone = item.member && item.member.phone;
            })
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
        this.saleOrderList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        this.saleOrderList()
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(param) {
        switch(param.method){
          case 'edit':
            this.$router.push({ 
              path:'/goodsAdded/added/edit',
              query:{
                  params: JSON.stringify(param.row),
                  method:'edit'
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
                path:'/goodsAdded/added/edit',
            }
        );
      },
      handleSearchList(){
        this.handleResetSize();
        this.saleOrderList()
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


