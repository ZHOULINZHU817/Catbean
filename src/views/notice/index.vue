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
          <el-form-item label="输入搜索：" prop="title">
            <el-input v-model="listQuery.title" class="input-width" placeholder="请输入公告标题"></el-input>
          </el-form-item>
          <!-- <el-form-item label="提交时间：" prop="createTime">
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
            :tableHead="newsTabHead"
            :isShowSelection="true"
            :sortable="true"
            :isShowPage="true"
            :isShowSeq="true"
            :currentSize="currentSize"
            :currentPage="currentPage"
            :buttonCellWidth="200"
            :height="'400'"
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
  import { newsTabHead } from "./table.js";
  import {noticeDelete, noticeList,} from "@/api/catApi/noticeApi"
  export default {
    name: "orderList",
    components:{
        CustomTable
    },
    data() {
      return {
        // 主表默认配置
        viewTableData: [],
        newsTabHead: newsTabHead, //主表表头
        total: 0,//主表数据长度
        currentSize: 5,//主表分页size
        currentPage: 0,//主表分页page
        listQuery: {
          page: 0,
          size: 5,
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
      }
    },
    created() {
      
    },
    mounted(){
      this.getNoticeList();
    },
    methods: {
      doubleClick(){

      },
      getRowData(){

      },
      getSelection(){

      },
      handleSearchList(){
        this.handleResetSize();
        this.getNoticeList()
      },
      handleResetSearch(){
        this.$refs['listQuery'].resetFields();
      },
      sizeChange(val) {
        this.currentSize = val
        this.listQuery.size = this.currentSize
        this.getNoticeList()
      },
      currentChange(val) {
        this.currentPage = val
        this.listQuery.page = this.currentPage-1;
        this.getNoticeList()
      },
      handleResetSize() {
        this.currentPage = 0
        this.listQuery.page = this.currentPage;
      },
      handleOperation(param) {
        switch(param.method){
          case 'edit':
            this.$router.push({ 
              path:'/notice/news/add',
              query:{
                  id: param.row.id
              }
            });
            break;
          case 'delete':
            this.setNoticeDelete(param.row)
            break;
        }
      },
      handleAddShop() {
         this.$router.push(
           { 
              path:'/notice/news/add'
            }
        );
      },
      /***列表 */
      getNoticeList(){
        noticeList(this.listQuery).then(res=>{
          if(res.code == '200'){
            let { records, total} = res.data;
            this.viewTableData = records || [];
            this.total = total
          }
        })
      },
      //删除
      setNoticeDelete(){
        noticeDelete().then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getNoticeList();
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


