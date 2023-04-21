<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          ref="listQuery"
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：" prop="memberPhone">
            <el-input
              v-model="listQuery.memberPhone"
              class="input-width"
              placeholder="请输入会员手机号"
            ></el-input>
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
              placeholder="请选择时间"
            >
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
        :tableHead="withdrawTabHead"
        :isShowSelection="true"
        :sortable="true"
        :isShowPage="true"
        :currentSize="currentSize"
        :currentPage="currentPage"
        :buttonCellWidth="200"
        :height="'500'"
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
    <el-dialog title="拒绝提现" :visible.sync="dialogVisible" width="50%">
      <custom-form
        ref="subForm"
        :label-width="'150px'"
        :rules="rules"
        :form="formInfo"
        :fields="fields"
        style="margin-bottom: 20px; padding-right: 30px"
        :labelWidth="'150px'"
        :formMaxWidth="'dept'"
        class="shopCar"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提现方式" :visible.sync="dialogVisibleNew" width="50%">
      <div style="display: flex">
        <div>{{payTitle}}:</div>
        <img
           v-image-preview
           v-if="payObj.payType == 'wx' || payObj.payType == 'ali'"
          style="width: 200px; height: 300px;margin-left:100px;"
          :src="payObj.payUrl || 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg'"
        />
         <!-- <img v-image-preview v-if="!!fields.picUrl" :src="fields.picUrl" referrerpolicy="no-referrer"> -->
        <div style="margin-left:30px;" v-if="payObj.payType == 'bank'">
          <div>{{payObj.member && payObj.member.bank}}</div>
          <div>{{payObj.member && payObj.member.bankNo}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleNew = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CustomTable from "@/components/CustomTable/index.vue";
import CustomForm from "@/components/CustomForm/indexNew.vue";
import { withdrawTabHead } from "./table.js";
import { withdrawList, assetAudit } from "@/api/catApi/memberApi";
let stateList = {
  reject:"已拒绝",
  finish:"已完成",
  audit:"待审核"
}
let payTypeList = {
  wx:"微信提现",
  ali:"支付宝提现",
  bank:"银行卡提现"
}
export default {
  name: "withdrawList",
  components: {
    CustomTable,
    CustomForm,
  },
  data() {
    return {
      // 主表默认配置
      viewTableData: [],
      withdrawTabHead: withdrawTabHead, //主表表头
      total: 0, //主表数据长度
      currentSize: 10, //主表分页size
      currentPage: 0, //主表分页page
      listQuery: {
        page: 0,
        size: 10,
        createTime: [
          new Date(new Date().toLocaleDateString()).getTime() -
            31 * 24 * 3600 * 1000,
          new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1,
        ],
      },
      mainButtons: {
        list: [
          {
            label: "同意",
            type: "text",
            size: "mini",
            method: "edit",
            if: (param) => { //audit
              if(param.state == 'audit'){
                return true;
              }else{
                return false;
              }
            },
          },
          {
            label: "拒绝",
            type: "text",
            size: "mini",
            method: "delete",
            class: "delete",
            if: (param) => {
              if(param.state == 'audit'){
                return true;
              }else{
                return false;
              }
            },
          },
        ],
      },
      dialogVisible: false,
      dialogVisibleNew: false,
      rules: {
        reason: [
          {
            required: true,
            message: "请输入拒绝原因",
            trigger: "blur",
          },
        ],
      },
      formInfo: {
        reason: "",
      },
      fields: [
        {
          keyName: "reason",
          label: "原因",
          type: "textarea",
          maxlength: 20,
          formMaxWidth: 24,
        },
      ],
      payTitle:'',
      payObj: {}
    };
  },
  created() {
    this.getWithdrawList();
  },
  methods: {
    doubleClick() {},
    getRowData() {},
    getSelection() {},
    sizeChange(val) {
      this.currentSize = val
      this.listQuery.size = this.currentSize
      this.getWithdrawList()
    },
    currentChange(val) {
      this.currentPage = val
      this.listQuery.page = this.currentPage-1
      this.getWithdrawList()
    },
    handleResetSize() {
      this.currentPage = 0
      this.listQuery.page = this.currentPage;
    },
    handleSearchList(){
      this.handleResetSize();
      this.getWithdrawList()
    },
    handleResetSearch(){
      this.$refs['listQuery'].resetFields();
    },
    handleOperation(params) {
      console.log("++++", params.row.member)
      this.row = params.row;
      switch (params.method) {
        case "edit":
          this.payObj = params.row && params.row;
          this.payObj.payUrl =  params.row.payType == 'wx' ? this.payObj.member.wechatUrl : this.payObj.member.alipayUrl;
          this.payTitle =  params.row &&  params.row.payTypes;
          this.dialogVisibleNew = true;
          break;
        case "delete":
          this.dialogVisible = true;
          break;
      }
    },
    //拒绝提现
    handleConfirm() {
      this.$refs["subForm"].validate("", (boolean) => {
        if (boolean) {
          let params = {
              reason: this.formInfo.reason,
              reject: true,
              withdrawRecordId: this.row.id,
            }
            assetAudit(params).then(res=>{
              if(res.code == '200'){
                this.$message({
                  message: '拒绝提现成功！',
                  type: 'success',
                  duration: 1000
                });
                this.dialogVisible = false;
                this.getWithdrawList();
              }
            })
        }
      })
    },
    //同意提现
    handleConfirmSave() {
      let params = {
        reason: '',
        reject: false,
        withdrawRecordId: this.row.id,
      }
      assetAudit(params).then(res=>{
        if(res.code == '200'){
          this.$message({
            message: '提现成功',
            type: 'success',
            duration: 1000
          });
          this.dialogVisibleNew = false;
          this.getWithdrawList();
        }
      })
    },
    /**获取列表** */
    getWithdrawList() {
      let params = {
        begin: this.listQuery.createTime[0],
        end: this.listQuery.createTime[1],
        page: this.listQuery.page,
        size: this.listQuery.size,
        memberPhone: this.listQuery.memberPhone,
      };
      withdrawList(params).then((res) => {
        if (res.code == "200") {
          let { records, total } = res.data;
          this.viewTableData = records || [];//[{payeeName:"sadad", id:'123'}]//
          // this.viewTableData[2].payType = "bank"
          // this.viewTableData[2].member.bank="掌上银行"
          // this.viewTableData[2].member.bankNo="342321424242242"
          // console.log('this.viewTableData[2].member', this.viewTableData[2].member)
          this.total = total;
          this.viewTableData.map(item=>{
            item.memberPhone = item.member && item.member.phone;
            item.memberName = item.member && item.member.name;
            item.states = stateList[item.state]
            item.payTypes = payTypeList[item.payType]
          })
        }
      });
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 280px;
}
</style>


