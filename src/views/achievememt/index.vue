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
          <el-form-item label="输入搜索：" prop="memberPhone">
            <el-input v-model="listQuery.memberPhone" class="input-width" placeholder="请输入会员手机号"></el-input>
          </el-form-item>
          <el-form-item label="场次搜索：" prop="type">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width" style="width: 220px;">
                <el-option v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </el-option>
            </el-select>
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
    <div class="total-amount">累计业绩：¥{{totalAmount}}</div>
    <div class="table-container">
        <custom-table
            :tableData="viewTableData"
            :tableHead="achievememtTabHead"
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
            :height="'450'"
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
  import { teamBuyList } from "@/api/catApi/memberApi"
  import CustomTable from "@/components/CustomTable/index.vue"
  import { achievememtTabHead } from "./table.js";
  let typeList = {
    twelve:'12：00场',
    sixteen:'16：00场',
    twenty:'20：00场'
  }
  export default {
    name: "achievememt",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        achievememtTabHead: achievememtTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 10,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          type: null,
          page: 0,
          size: 10,
          createTime:[new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 3600 * 1000, new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1]
        },
        mainButtons:{
            list:[
            ],
        },
        statusOptions:[
            {label:"12：00场",value:'twelve'},
            {label:"16：00场",value:'sixteen'},
            {label:"20：00场",value:'twenty'}
        ],
        totalAmount: '--',
      }
    },
    created() {
    //   this.getTeamBuyList();
    },
    methods: {
      getTeamBuyList(){
        let params = {
            begin: this.listQuery.createTime[0],
            end: this.listQuery.createTime[1],
            page: this.listQuery.page,
            size: this.listQuery.size,
            memberPhone: this.listQuery.memberPhone,
            type: this.listQuery.type
        }
        teamBuyList(params).then((res)=>{
           if(res.code == '200'){
            let { records, total, totalAmount} = res.data;
            this.viewTableData = records || [];
            this.totalAmount = totalAmount || '--';
            this.viewTableData.map(item=>{
                item.type = item.saleOrder && typeList[item.saleOrder.type];
                item.price = item.saleOrder && item.saleOrder.price;
                item.createTime = item.actPaidTime;
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
        this.getTeamBuyList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        this.getTeamBuyList()
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
        this.getTeamBuyList()
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
  .total-amount{
    font-size: 18px;
    color:#606266;
    padding-top:16px;
  }
</style>


