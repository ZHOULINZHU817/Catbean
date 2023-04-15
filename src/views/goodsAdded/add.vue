<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="addedInfoForm" label-width="120px" class="form-inner-container" size="small">
      <el-form-item label="价格：" prop="price" style="width: 340px;">
         <el-input type="number" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="场次：" prop="type">
         <el-select v-model="form.type" placeholder="全部" clearable class="input-width" style="width: 220px;">
            <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抢购时间：" prop="startBuyTime">
        <el-date-picker
            class="input-width"
            v-model="form.startBuyTime"
            value-format="timestamp"
            type="date"
            placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top:100px;">
        <el-button type="primary" size="medium" @click="handleSave('addedInfoForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {
    saleOrderEdit,
    saleOrder
  } from "@/api/catApi/addedOrderApi";
  import { formatDate } from "@/utils/date"
  export default {
    name: "addedDetail",
    components: {
       
    },
    data() {
      return {
        form: {
           startBuyTime:''
        },
        rules: {
          type: [{required: true, message: '请选择场次', trigger: 'blur'}],
          startBuyTime: [{required: true, message: '请选择时间', trigger: 'blur'}]
        },
        statusOptions:[
            {label:"12：00场",value:'twelve'},
            {label:"16：00场",value:'sixteen'},
            {label:"20：00场",value:'twenty'}
        ]
      };
    },
    created() {
    //   this.id = this.$route.query.id;
    //   if(this.id){
    //     // this.productDetail();
    //   }
        let { method, params} = this.$route.query;
        this.row = params && JSON.parse(params);
        this.method = method;
        if(method == 'edit'){
            this.form = this.row;
            this.form.startBuyTime = new Date(new Date(this.form.startBuyTime)).getTime();
        }
    },
    
    methods: {
      handleBrandChange(){

      },
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.method == 'edit'){
              this.saleOrderEdit();
            }else{
              this.saleOrder()
            }
          }
        });
      },
      saleOrder(){
        saleOrder(this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
            this.$router.go(-1);
          }
        })
      },
      saleOrderEdit(){
        delete this.form.$index
        saleOrderEdit(this.row.id, this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .form-container {
    width: 960px;
  }
  .form-inner-container {
    width: 800px;
  }
</style>
