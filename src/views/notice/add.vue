<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="newsDetail" label-width="120px" class="form-inner-container" size="small">
      
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
       <el-form-item label="链接：" prop="link">
        <el-input v-model="form.link"></el-input>
      </el-form-item>
       <el-form-item label="内容介绍：">
        <el-input
          v-model="form.content"
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
  import {noticeAdd, noticeEdit, noticeDetail} from "@/api/catApi/noticeApi"
  export default {
    name: "newsDetail",
    components: {
       
    },
    data() {
      return {
        form: {
            
        },
        rules: {
          title: [
            {required: true, message: '请输入公告标题名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          // link:[]
        }
      };
    },
    created() {
      this.id = this.$route.query.id;
      if(this.id){
        this.noticeDetail();
      }
    },
    
    methods: {
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.id){
              this.getNoticeEdit();
            }else{
              this.getNoticeAdd();
            }
          }
        });
      },
      getNoticeAdd() {
        noticeAdd(this.form).then(res=>{
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
      getNoticeEdit() {
         noticeEdit(this.id, this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        })
      },
      /***查询详情的接口* */
      noticeDetail(){
        noticeDetail(this.id).then(res=>{
          if(res.code == '200'){
            this.form = res.data;
          }
        })
      }
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
