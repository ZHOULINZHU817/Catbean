<template>
    <div style="padding: 30px;">
      <el-form :model="objJson" style="width: 660px;padding-top:20px;" label-width="160px">
          <el-form-item label="当前APP版本号：">
            <div>{{objJson.versionNum || '2.2.2'}}</div>
          </el-form-item>
          <el-form-item label="设置APP版本号：">
            <el-input v-model="objJson.version" class="input-width" placeholder="请输入APP版本号"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;padding-top:80px;">
            <el-button type="primary" size="medium" @click="handleSave('productInfoForm')">提交</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>

export default {
    name:'version',
    data() {
        return {
            objJson: {}
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>
