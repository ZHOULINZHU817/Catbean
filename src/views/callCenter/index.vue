<template>
    <div style="padding: 30px;">
      <el-form style="width: 660px;"  label-width="120px">
          <el-form-item label="设置客服微信：">
                <multi-upload v-model="selectProductPics"></multi-upload>
          </el-form-item>
          <el-form-item style="text-align: center;padding-top:80px;">
            <el-button type="primary" size="medium" @click="handleSavePic">保存</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import MultiUpload from '@/components/Upload/multiUpload'
export default {
    name:'recharge',
    components: {
        MultiUpload
    },
    data() {
        return {
            selectProductPics: ['http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg']
        }
    },
    mounted() {
       
    },
    methods: {
        /***图片保存* */
        handleSavePic() {
            console.log('+++', this.selectProductPics)
        }
    }
}
</script>
