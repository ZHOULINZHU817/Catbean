<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" class="form-inner-container" size="small">
      <!-- <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item> -->
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input type="number" v-model="value.price"></el-input>
      </el-form-item>
       <el-form-item label="商品规格：" prop="spec">
        <el-input v-model="value.spec"></el-input>
      </el-form-item>
       <el-form-item label="库存数量：" prop="num">
        <el-input type="number" v-model="value.num"></el-input>
      </el-form-item>
       <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.previewStatus"
          :active-value="1"
          :inactive-value="0">
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
import MultiUpload from '@/components/Upload/multiUpload'
  export default {
    name: "ProductInfoDetail",
    components: {
        MultiUpload
    },
    data() {
      return {
        value: {
            
        },
        selectProductPics: ['http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf5fN2522b9dc.jpg'],
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
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

<style scoped>
  .form-container {
    width: 960px;
  }
  .form-inner-container {
    width: 800px;
  }
</style>
