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
      <div style="margin-top: 30px">
        <el-form ref="listQuery" :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item v-if="isShowTime" label="输入搜索：" prop="memberPhone">
            <el-input v-model="listQuery.memberPhone" class="input-width" placeholder="请输入会员手机号"></el-input>
          </el-form-item>
          <el-form-item v-if="!isShowTime" label="输入搜索：" prop="memberAccount">
            <el-input v-model="listQuery.memberAccount" class="input-width" placeholder="请输入付款人手机号"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowTime" label="状态：" prop="type">
            <!-- <el-input v-model="listQuery.type" class="input-width" placeholder="请输入场次" @keyup.enter.native="handleSearchList()"></el-input> -->
            <el-select v-model="listQuery.type" placeholder="请选择" clearable class="input-width" style="width: 220px;">
                <el-option v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="!isShowTime" label="时间：">
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
    <!-- <div class="table-container">
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
    </div> -->
    <div class="table-container">
      <el-tabs type="border-card" v-model="activeName"  @tab-click="handleTabClick">
        <el-tab-pane label="猫豆记录" name="catBeanRecord">
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
        </el-tab-pane>
        <el-tab-pane label="转赠记录" name="donation">
           <custom-table
            :tableData="viewTableData"
            :tableHead="donationTabHead"
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import { catFoodList, transferList } from "@/api/catApi/addedOrderApi"
  import CustomTable from "@/components/CustomTable/index.vue"
  import { catFoodTabHead, donationTabHead } from "./table.js";
  let catBean = {
    out:'转出好友', //-
    recharge: '平台购入',//+
    breach: '违约',//-
    into: '好友转赠', //+
    withdraw: "猫豆提现",//-
    payOrder: "支付订单", //-
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
        donationTabHead: donationTabHead,
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
        statusOptions:[
            {label:"转出好友",value:'out'},
            {label:"平台购入",value:'recharge'},
            {label:"违约",value:'breach'},
            {label:"好友转赠",value:'into'},
            {label:"猫豆提现",value:'withdraw'},
            {label:"支付订单",value:'payOrder'},
            {label:"猫超订单",value:'mallOrder'},
            {label:"预约冻结",value:'reserveFrozen'},
            {label:"预约返还",value:'reserveRefund'},
            {label:"奖励金兑换",value:'exchangeBuy'},
            {label:"分润兑换",value:'exchangeTeam'},
            {label:"分享值兑换",value:'exchangeChild'},
            {label:"订单售出",value:'saleOrder'},
        ],
        activeName: 'catBeanRecord',
        isShowTime: true,
      }
    },
    created() {
      this.getCatFoodList();
    },
    methods: {
      getCatFoodList(){
        let params = {
            // begin: this.listQuery.createTime[0],
            // end: this.listQuery.createTime[1],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
            type: this.listQuery.type,
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
      getTransferList() {
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[1],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberAccount: this.listQuery.memberAccount
        }
        transferList(params).then((res)=>{
           if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.viewTableData.map(item=>{
                item.intoPhone = item.payee && item.payee.phone;
                item.outPhone = item.payer && item.payer.phone;
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
        if(this.activeName == 'catBeanRecord'){
          this.getCatFoodList();
        }else{
          this.getTransferList()
        }
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        if(this.activeName == 'catBeanRecord'){
          this.getCatFoodList();
        }else{
          this.getTransferList()
        }
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
        if(this.activeName == 'catBeanRecord'){
          this.getCatFoodList();
        }else{
          this.getTransferList()
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
        this.activeName = tab.name;
        switch(tab.name){
          case 'catBeanRecord': //猫豆
            this.isShowTime = true;
            this.getCatFoodList();
            break;
          case 'donation': //转赠
            this.isShowTime = false;
            this.getTransferList();
            break;
        }
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 280px;
  }
</style>


