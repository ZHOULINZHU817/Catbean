<template>
  <div style="padding: 30px">
    <el-form :model="form" :rules="rules" style="width: 660px" label-width="120px">
      <el-form-item label="首页轮播图：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="图片标题：" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="图片上架：">
        <el-switch
          v-model="form.offline"
          :active-value="'true'"
          :inactive-value="'false'"
        >
        </el-switch>
      </el-form-item>
      <el-form-item style="text-align: center; padding-top: 80px">
        <el-button type="primary" size="medium" @click="handleSavePic"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import MultiUpload from "@/components/Upload/multiUpload";
import { bannerAdd, bannerEdit, bannerDetail } from "@/api/catApi/bannerApi";
export default {
  name: "recharge",
  components: {
    MultiUpload,
  },
  data() {
    return {
      selectProductPics: [],
      form:{

      },
      rules: {}
    };
  },
  mounted() {
    this.id = this.$route.query.id;
      if(this.id){
        this.bannerDetail();
    }
  },
  methods: {
    /***图片保存* */
    handleSavePic() {
        this.form.image = this.selectProductPics[0];
        if(this.id){
            this.bannerEdit();
        }else{
            this.bannerAdd()
        }
      
    },
    bannerAdd() {
        bannerAdd(this.form).then((res) => {
            if (res.code == "200") {
            this.$message({
                message: "保存成功",
                type: "success",
                duration: 1000,
            });
            this.$router.go(-1);
            }
        });
    },
    bannerEdit(){
        bannerEdit().then(res=>{
            if (res.code == "200") {
                this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000,
                });
            }
        })
    },
    bannerDetail() {
    //   bannerList({ page: 0, size: 100 }).then((res) => {
    //     if (res.code == "200") {
    //       let { records } = res.data;
    //       this.selectProductPics = records || [];
    //     }
    //   });
    },
  },
};
</script>
