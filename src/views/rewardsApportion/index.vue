<template> 
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never">
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
          <el-form-item label="输入搜索：" prop="phone">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="会员"></el-input>
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
    </el-card> -->
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
            :tableHead="rewardsTabHead"
            :isShowSelection="true"
            :sortable="true"
            :isShowPage="false"
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
  </div>
</template>
<script>
  import CustomTable from "@/components/CustomTable/index.vue"
  import { rewardsTabHead } from "./table.js";
  import { teamList } from "@/api/catApi/setApi"
  export default {
    name: "rewardsList",
    components:{
        CustomTable,
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        rewardsTabHead: rewardsTabHead, //主表表头
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
                    label: "编辑",
                    type: "text",
                    size: "mini",
                    method: "edit",
                    if: (param) => {
                      return true;
                    },
                }
            ],
        },
      }
    },
    created() {
      this.teamList();
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
        this.teamList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1
        this.teamList()
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(params) {
        switch(params.method){
            case 'edit': //冻结
              this.$router.push({ 
                path:'/rewardsApportion/apportion/edit',
                query:{
                    params: JSON.stringify(params.row),
                    method:'edit'
                }
              });
              break;
        }
      },
      teamList(){
        teamList().then(res=>{
          if(res.code == '200'){
            // let { records, total} = res.data; 
            this.viewTableData = res.data || []; //[{status: false, phone:'123'},{status: true, phone:'456'}]
            // this.viewTableData.map(item=>{
            //   item.state = item.status ? '正常':'冻结';
            // })
            // this.total = total
           }
        })
      },
      handleSearchList(){
        this.handleResetSize();
        this.teamList()
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


