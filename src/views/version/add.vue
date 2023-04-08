<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="versionDetail" label-width="120px" class="form-inner-container" size="small">
      
      <el-form-item label="版本号：" prop="number">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
         <el-select v-model="form.type" placeholder="请选择" clearable class="input-width" style="width: 220px;">
            <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="强制更新：" prop="forced">
         <el-switch
          v-model="form.forced"
          :active-value="true"
          :inactive-value="false">
        </el-switch>
      </el-form-item> 
      <el-form-item label="安装包链接：" prop="url">
          <single-upload v-model="form.url"></single-upload>
      </el-form-item>
       <el-form-item label="版本说明：" prop="note">
        <el-input
          :autoSize="true"
          v-model="form.note"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 100px;">
        <el-button type="primary" size="medium" @click="handleSave('versionDetail')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { versionSave } from "@/api/catApi/setApi"
  import SingleUpload from '@/components/Upload/singleUpload'
  export default {
    name: "versionDetail",
    components: {
       SingleUpload
    },
    data() {
      return {
        statusOptions:[
            {label:"Android",value:'apk'},
            {label:"IOS",value:'ipa'}
        ],
        form: {
            url: []
        },
        rules: {
          number: [
            {required: true, message: '请输入版本号', trigger: 'blur'}
          ],
          type:[{required: true, message: '请选择类型', trigger: 'blur'}],
          forced:[{required: true, message: '请选择', trigger: 'blur'}],
          url:[{required: true, message: '请选择', trigger: 'blur'}],
          note:[{required: true, message: '请输入版本说明', trigger: 'blur'}],
        }
      };
    },
    created() {
       
    },
    
    methods: {
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.versionSave();
          }
        });
      },
      versionSave() {
         delete this.form.$index
         versionSave(this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '发布成功',
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
