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
            :tableHead="catFoodTabHead"
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
            :height="'500'"
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
  import { catFoodList } from "@/api/catApi/addedOrderApi"
  import CustomTable from "@/components/CustomTable/index.vue"
  import { catFoodTabHead } from "./table.js";
  let catBean = {
    out:'转出好友', //-
    recharge: '平台购入',//+
    breach: '违约',//-
    into: '好友转赠', //+
    withdraw: "猫豆提现",//-
    payOrder: "预约消耗", //-
    mallOrder: "猫超订单", //-
    reserveFrozen: "预约冻结", //-
    reserveRefund: "预约返还", //+
    exchangeBuy: "奖励金兑换", //+
    exchangeTeam: "分润兑换", //+
    exchangeChild: "分享值兑换", //+
    saleOrder: "订单售出", //+
 }
  export default {
    name: "rechargeList",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        catFoodTabHead: catFoodTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 10,
          createTime:[new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 3600 * 1000, new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1]
        },
        mainButtons:{
            list:[
            ],
        },
      }
    },
    created() {
      this.getCatFoodList();
    },
    methods: {
      getCatFoodList(){
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[1],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
        }
        catFoodList(params).then((res)=>{
           if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.viewTableData.map(item=>{
                item.types = catBean[item.type];
                item.amount = this.getItemType(item.type) + item.amount;
                item.memberPhone = item.member && item.member.phone;
            })
            this.total = total
           }
        })
      },
       getItemType(type){
        let typeText = '-'
        switch(type){
            case 'recharge':
            typeText = "+"
            break;
            case 'into':
            typeText = "+"
            break;
            case 'reserveRefund':
            typeText = "+"
            break;
            case 'exchangeBuy':
            typeText = "+"
            break;
            case 'exchangeTeam':
            typeText = "+"
            break;
            case 'exchangeChild':
            typeText = "+"
            break;
            case 'saleOrder':
            typeText = "+"
            break;
        }
        return typeText;
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
        this.getCatFoodList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        this.getCatFoodList()
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(param) {
        // switch(param.method){
        //   case 'edit':
        //     this.$router.push({ 
        //       path:'/banner/picture/add',
        //       query:{
        //           id: param.row.id
        //       }
        //     });
        //     break;
        //   case 'delete':
        //     this.goodDelete(param.row)
        //     break;
        // }
      },
      handleSearchList(){
        this.handleResetSize();
        this.getCatFoodList()
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


