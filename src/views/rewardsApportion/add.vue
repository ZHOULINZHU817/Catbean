<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="rewardsDetail" label-width="120px" class="form-inner-container" size="small">
      
      <el-form-item label="名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="直推数量：" prop="childNum">
        <el-input type="number" v-model="form.childNum"></el-input>
      </el-form-item>
      <el-form-item label="比率：" prop="ratio	">
        <el-input type="number" v-model="form.ratio"></el-input>
      </el-form-item>
      <el-form-item label="团队数量：" prop="teamNum">
        <el-input type="number" v-model="form.teamNum"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 100px;">
        <el-button type="primary" size="medium" @click="handleSave('rewardsDetail')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { teamEdit } from "@/api/catApi/setApi"
  export default {
    name: "rewardsDetail",
    components: {
       
    },
    data() {
      return {
        form: {
            
        },
        rules: {
          // title: [
          //   {required: true, message: '请输入公告标题名称', trigger: 'blur'},
          //   {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          // ],
          // link:[]
        }
      };
    },
    created() {
        let { method, params} = this.$route.query;
        this.form = JSON.parse(params);
        // this.method = method;
        // if(method == 'edit'){
        //     this.form = this.row;
        //     this.form.startBuyTime = new Date(new Date(this.form.startBuyTime)).getTime();
        // }
    },
    
    methods: {
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.teamEdit();
          }
        });
      },
      teamEdit() {
         delete this.form.$index
         teamEdit(this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.$router.go(-1);
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form-container {
    width: 960px;
  }
  .form-inner-container {
    width: 800px;
  }
</style>
