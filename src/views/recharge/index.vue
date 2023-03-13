<template>
    <div style="padding: 30px;">
      <el-form :model="objJson" style="width: 660px;"  label-width="120px">
          <el-form-item label="输入搜索：">
            <el-input v-model="objJson.orderSn" placeholder="会员电话号">
                <el-button slot="append" icon="el-icon-search" @click="searchMember"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="当前猫豆：">
            <div>30</div>
          </el-form-item>
          <el-form-item label="充值金额：">
            <el-input v-model="objJson.Amount" class="input-width" type="number" placeholder="请输入充值金额"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;padding-top:80px;">
            <el-button type="primary" size="medium" @click="handleSaveRecharge">充值</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>

export default {
    name:'recharge',
    data() {
        return {
            objJson: {
                orderSn:'',
                Amount: 0
            }
        }
    },
    mounted() {

    },
    methods: {
        searchMember() {
            debugger
        },
        /***充值* */
        handleSaveRecharge() {

        }
    }
}
</script>
