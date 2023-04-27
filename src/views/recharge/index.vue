<template>
    <div style="padding: 30px;">
      <el-form :model="objJson" :rules="rules" ref="rechargeForm" style="width: 660px;"  label-width="120px">
          <el-form-item label="输入搜索：" prop="phone">
            <el-input type="mod" v-model="objJson.phone" placeholder="会员电话号">
                <el-button slot="append" icon="el-icon-search" @click="searchMember"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="当前猫豆：">
            <div>{{catFood}}</div>
          </el-form-item>
          <el-form-item label="充值金额：" prop="amount">
            <el-input v-model="objJson.amount" class="input-width" type="number" placeholder="请输入充值金额"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;padding-top:80px;">
            <el-button size="medium" @click="payRank">充值记录</el-button>
            <el-button type="primary" size="medium" @click="handleSaveRecharge" :disabled="disabledBtn">充值</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import { memberPhone, recharge } from "@/api/catApi/memberApi"
import { Throttle } from "@/utils/index"
export default {
    name:'recharge',
    data() {
        return {
            catFood: 0,
            objJson: {
              phone:'',
              amount: 0,
            },
            rules: {
              phone: [{required: true, message: '请输入会员手机号', trigger: 'blur'}],
              amount: [{required: true, message: '请输入充值金额', trigger: 'blur'}],
            },
            disabledBtn: false,
        }
    },
    mounted() {

    },
    methods: {
        searchMember() {
           const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
           if(!reg.test(this.objJson.phone)){
              this.$message({
                message: '请输入正确的手机号',
                type: 'warning',
                duration: 1000
              });
              return;
           }
           let params = {
            phone: this.objJson.phone
           }
           memberPhone(params).then(res=>{
            if(res.code == '200'){
                this.catFood = res.data.catFood;
            }
           })
        },
        /***充值* */
        handleSaveRecharge: Throttle(function () {
            this.$refs['rechargeForm'].validate((valid) => {
              if (valid) {
                this.disabledBtn = true;
                this.objJson.amount = this.objJson.amount*1;
                console.log('222', this.objJson)
                recharge(this.objJson).then(res=>{
                  if(res.code == '200'){
                    this.$message({
                      message: '充值成功',
                      type: 'success',
                      duration: 1000
                    });
                    this.disabledBtn = false;
                  }
                })
              }
            });
        }, 1000),
        payRank(){
          this.$router.push({ 
            path:'/recharge/catBean/list'
          });
        }
    }
}
</script>
