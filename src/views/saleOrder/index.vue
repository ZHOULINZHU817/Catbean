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
    <div class="table-container">
        <el-tabs type="border-card" v-model="activeName"  @tab-click="handleTabClick">
            <el-tab-pane label="已预约" name="appointment">
                <custom-table
                    :tableData="viewTableData"
                    :tableHead="appointmentTabHead"
                    :isShowSelection="true"
                    :sortable="true"
                    :isShowPage="true"
                    :currentSize="currentSize"
                    :currentPage="currentPage"
                    :buttonCellWidth="200"
                    :total="total"
                    :rowEdit="false"
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
            </el-tab-pane>
            <el-tab-pane label="抢购中" name="specialOffer">
                <custom-table
                    :tableData="viewTableData"
                    :tableHead="specialOfferTabHead"
                    :isShowSelection="true"
                    :sortable="true"
                    :isShowPage="true"
                    :currentSize="currentSize"
                    :currentPage="currentPage"
                    :buttonCellWidth="200"
                    :total="total"
                    :rowEdit="false"
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
            </el-tab-pane>
            <el-tab-pane label="转卖中" name="resale">
                <custom-table
                    :tableData="viewTableData"
                    :tableHead="resaleTabHead"
                    :isShowSelection="true"
                    :sortable="true"
                    :isShowPage="true"
                    :currentSize="currentSize"
                    :currentPage="currentPage"
                    :buttonCellWidth="200"
                    :total="total"
                    :rowEdit="false"
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
            </el-tab-pane>
            <el-tab-pane label="已违约" name="breakPromise">
                <custom-table
                    :tableData="viewTableData"
                    :tableHead="breakPromiseTabHead"
                    :isShowSelection="true"
                    :sortable="true"
                    :isShowPage="true"
                    :currentSize="currentSize"
                    :currentPage="currentPage"
                    :buttonCellWidth="200"
                    :total="total"
                    :rowEdit="false"
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
            </el-tab-pane>
            <el-tab-pane label="已完成" name="finish">
                <custom-table
                    :tableData="viewTableData"
                    :tableHead="finishTabHead"
                    :isShowSelection="true"
                    :sortable="true"
                    :isShowPage="true"
                    :currentSize="currentSize"
                    :currentPage="currentPage"
                    :buttonCellWidth="200"
                    :total="total"
                    :rowEdit="false"
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
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>
  import CustomTable from "@/components/CustomTable/index.vue"
  import { appointmentTabHead, specialOfferTabHead, resaleTabHead, breakPromiseTabHead, finishTabHead } from "./table.js";
  import { recordBuyList, reserveList } from "@/api/catApi/addedOrderApi";
  let typeList = {
    twelve:'12：00场',
    sixteen:'16：00场',
    twenty:'20：00场'
  }
  let statusList = {

  }
  export default {
    name: "saleOrderList",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        appointmentTabHead: appointmentTabHead, //主表表头
        specialOfferTabHead: specialOfferTabHead,
        resaleTabHead: resaleTabHead,
        breakPromiseTabHead: breakPromiseTabHead,
        finishTabHead: finishTabHead,
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
            // {
            //     label: "删除",
            //     type: "text",
            //     size: "mini",
            //     method: "copy",
            //     if: () => {
            //     return true;
            //     },
            // },
            ],
        },
        activeName:'appointment',

      }
    },
    created() {
      this.reserveList();
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
        if(this.activeName == 'appointment'){
          this.reserveList();
        }else{
          this.recordBuyList();
        }
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        if(this.activeName == 'appointment'){
          this.reserveList();
        }else{
          this.recordBuyList();
        }
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation() {

      },
      handleSearchList(){
        this.handleResetSize();
        if(this.activeName == 'appointment'){
          this.reserveList();
        }else{
          this.recordBuyList();
        }
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      },
      handleTabClick(tab) {
        this.viewTableData = [];
        this.handleResetSize();
        this.handleResetSearch();
        switch(tab.name){
          case 'appointment': //预约
            this.reserveList();
            break;
          case 'specialOffer': //抢购
            this.listQuery.status='buying', //reserved, buying, resell, breach, finish
            this.recordBuyList();
            break;
          case 'resale': // 转卖
            this.listQuery.status='resell', //reserved, buying, resell, breach, finish
            this.recordBuyList();
            break;
          case 'breakPromise': //违约
            this.listQuery.status='breach', //reserved, buying, resell, breach, finish
            this.recordBuyList();
            break;
          case 'finish': //完成
            this.listQuery.status='finish', //reserved, buying, resell, breach, finish
            this.recordBuyList();
            break;
        }
      },
      /**其他* */
      recordBuyList() {
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[0],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
            status: this.listQuery.status, //reserved, buying, resell, breach, finish
        }
        recordBuyList(params).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data; 
            this.viewTableData = records || []; //[{status: false, phone:'123'},{status: true, phone:'456'}]
            this.viewTableData.map(item=>{
              // item.state = item.status ? '正常':'冻结';
              item.memberName = item.member && item.member.name ;
              item.memberPhone = item.member && item.member.phone;
              item.buyMemberName = item.buyMember && item.buyMember.name ;
              item.buyMemberPhone = item.buyMember && item.buyMember.phone;
              item.type = typeList[item.type];
            })
            this.total = total
          }
        })
      },
      /**预约* */
      reserveList(){
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[0],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
        }
        reserveList(params).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data; 
            this.viewTableData = records || []; //[{status: false, phone:'123'},{status: true, phone:'456'}]
            this.viewTableData.map(item=>{
              item.state = item.status ? '已预约':'未预约'; //type
              item.memberName = item.member && item.member.name ;
              item.memberPhone = item.member && item.member.phone;
            })
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


