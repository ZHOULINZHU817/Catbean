<template>
    <div style="padding: 30px;">
      <el-form style="width: 660px;"  label-width="120px">
          <el-form-item label="设置收款码：">
                <multi-upload v-model="selectProductPics" :maxCount="1"></multi-upload>
          </el-form-item>
          <el-form-item style="text-align: center;padding-top:80px;">
            <el-button type="primary" size="medium" @click="handleSavePic">保存</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import MultiUpload from '@/components/Upload/multiUpload'
import { callSetting, callSettingList } from "@/api/catApi/setApi"
export default {
    name:'payCode',
    components: {
        MultiUpload
    },
    data() {
        return {
            selectProductPics: []
        }
    },
    mounted() {
       this.callSettingList();
    },
    methods: {
        /***图片保存* */
        handleSavePic() {
            if(!this.selectProductPics.length){
                return;
            }
            let params= {
                list:[
                    {
                        description:'收款码',
                        name:'recharge_qr_code',
                        value: this.selectProductPics && this.selectProductPics[0] 
                    }
                ]
            }
            callSetting(params).then(res=>{
                if(res.code == '200'){
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        duration: 1000
                    });
                }
            })
        },
        callSettingList(){
            callSettingList().then(res=>{
                if(res.code == '200'){
                    res.data.map(item=>{
                        if(item.name == 'recharge_qr_code'){
                            this.selectProductPics.push(item.value);
                        }
                    })
                }
            })
        }
    }
}
</script>
