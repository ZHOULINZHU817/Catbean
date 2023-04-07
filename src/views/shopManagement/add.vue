<template>
  <div style="margin-top: 50px">
    <el-form :model="form" :rules="rules" ref="productInfoForm" label-width="120px" class="form-inner-container" size="small">
      <!-- <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item> -->
      <el-form-item label="商品相册：">
        <multi-upload v-model="imagesList"></multi-upload>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input type="number" v-model="form.price"></el-input>
      </el-form-item>
       <el-form-item label="商品规格：" prop="spec">
        <el-input v-model="form.spec"></el-input>
      </el-form-item>
       <el-form-item label="库存数量：" prop="stock">
        <el-input type="number" v-model="form.stock"></el-input>
      </el-form-item>
       <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="form.detail"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="form.status"
          :active-value="'online'"
          :inactive-value="'offline'">
        </el-switch>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleSave('productInfoForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//   import {fetchListWithChildren} from '@/api/productCate'
//   import {fetchList as fetchBrandList} from '@/api/brand'
//   import {getProduct} from '@/api/product';
import {
    productAdd,
    productEdit,
    productDetail
  } from "@/api/catApi/goodsApi";
import MultiUpload from '@/components/Upload/multiUpload'
  export default {
    name: "ProductInfoDetail",
    components: {
        MultiUpload
    },
    data() {
      return {
        form: {
            images:null
        },
        hasEditCreated:false,
        imagesList: [],
        //选中商品分类的值
        // selectProductCateValue: [],
        // productCateOptions: [],
        // brandOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
          spec: [{required: true, message: '请输入商品规格', trigger: 'blur'}],
          num: [{required: true, message: '请输入库存数量', trigger: 'blur'}],
        }
      };
    },
    created() {
      this.id = this.$route.query.id;
      if(this.id){
        this.productDetail();
      }
    },
    
    methods: {
      handleBrandChange(){

      },
      //保存商品
      handleSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.images = this.imagesList;
            if(this.id){
              this.productEdit();
            }else{
              this.productAdd()
            }
          }
        });
      },
      productAdd(){
        productAdd(this.form).then(res=>{
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
      productEdit(){
        productEdit(this.id, this.form).then(res=>{
          if(res.code == '200'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        })
      },
      productDetail(){
        productDetail(this.id).then(res=>{
          if(res.code == '200'){
            this.form = res.data;
            this.imagesList = this.form.images;
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
