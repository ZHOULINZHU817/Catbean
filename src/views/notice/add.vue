<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="newsDetail" label-width="120px" class="form-inner-container" size="small">
      
      <el-form-item label="标题：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
       <el-form-item label="内容介绍：">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="10"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 100px;">
        <el-button type="primary" size="medium" @click="handleSave('newsDetail')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "newsDetail",
    components: {
       
    },
    data() {
      return {
        form: {
            
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    created() {
      
    },
    
    methods: {
      handleBrandChange(){

      },
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          }
        });
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
