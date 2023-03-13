<template>
<el-form
    :model="form"
    :ref="formRef"
    :rules="rules"
    :label-width="labelWidth"
    :size="size"
    :label-position="labelPosition"
>
    <el-row :gutter="20">
        <el-col
            :span="v.formMaxWidth ? v.formMaxWidth : 6"
			:xl="v.responsive?v.responsive['xl']:undefined"
			:lg="v.responsive?v.responsive['lg']:undefined"
			:md="v.responsive?v.responsive['md']:undefined"
			:sm="v.responsive?v.responsive['sm']:undefined"
			:xs="v.responsive?v.responsive['xs']:undefined"
            v-for="(v, i) in fields"
            :key="i"
        >
            <template v-if="v.keyName || v.type=='buttons'">
                <el-form-item
                    :prop="v.keyName"
                    :style="v.height ? '' : 'height: 36px'"
                    v-show="!(isShowField && v.isHide)"
                >
                    <span slot="label">
                     <span class="span-box">
                       <span>{{v.label}}</span>
                        <el-tooltip v-if="v.tips" style="diaplay:inline" effect="dark" :content="v.tips" placement="right">
                          <i class="el-icon-question" style="font-size: 16px;color:#1890ff"/>
                        </el-tooltip>
                     </span>
                   </span>
                    <div v-if="v.type === 'input'" class="input-box">
                        <el-input
                            :ref="v.keyName"
                            @change="(value)=>{
								inputChange({
									detail:{
										keyName:v.keyName,
										value:value
									}
								})
							}"
                            @blur="blur(v.keyName)"
                            v-model.trim="form[v.keyName]"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            :maxlength="v.maxlength"
                            :clearable="v.clearable"
                            @clear="clear(v.keyName)"
                            :placeholder="
							v.placeholder
								? v.placeholder
								: v.flag
								? '只允许输入数字、字母、- 或_'
								: v.flagNum
								? '只允许输入数字'
								: v.flagNumInt
								? '只允许输入数字'
								: v.flagName
								? '只允许输入数值、字母、汉字、-或_'
								: v.flagLocation
								? '允许输入数值、字母、 - 、_'
								: v.flagBracket
								? '只允许输入数值、字母、汉字、-、( )'
								: v.flagProductName
								? '只允许输入数值、字母、汉字、() 、-或_'
								: v.flagNumEn
								? '只允许输入数字、字母'
								: ''
							"
                            @input="
							v.flag
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\-\_]/g,
									''
								))
								: v.flagNum
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\d(\.\d{0,4})?$]/g,
									''
								))
								: v.flagNumInt
								? (form[v.keyName] = form[v.keyName].replace(/[^0-9]/g, ''))
								: v.flagNumFloat
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\d(\.\d{0,2})?$]/g,
									''
								))
								: v.flagName
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_]/g,
									''
								))
								: v.flagLocation
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\-\_]/g,
									''
								))
								: v.flagBracket
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_\(\)\（\）]/g,
									''
								))
								: v.flagProductName
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_\(\)\（\）]/g,
									''
								))
								: v.flagNumEn
								? (form[v.keyName] = form[v.keyName].replace(
									/[^a-zA-Z0-9]/gi,
									''
								))
								: form[v.keyName]
							"
                            @keyup.enter.native="(event)=>{
                                handleSearch({
                                    detail:{
                                        keyName:v.keyName,
                                        event:event
                                    }
                                })
                            }"
                        >
							<el-button v-if="v.slot && v.slot.type=='button'" :slot="v.slot.append" :icon="v.slot.icon" @click="()=>{
								if(v.slot.method){
									v.slot.method({
										detail:{
											keyName:v.keyName
										}
									});
								}else{
									inputSlotClick({
										detail:{
											keyName:v.keyName
										}
									})
								}
							}"></el-button>
							<template v-if="v.slot && v.slot.type=='text'" :slot="v.slot.append">{{v.slot.text}}</template>
                        </el-input>
                    </div>
                    <div v-else-if="v.type === 'autofocus-input'" class="input-box">
                        <el-input
                            v-focus
                            :ref="v.keyName"
                            @focus="(val) => {inputFocus(v.keyName);}"
                            @change="(value)=>{
								inputChange({
									detail:{
										keyName:v.keyName,
										value:value
									}
								})
							}"
                            @blur="blur(v.keyName)"
                            v-model.trim="form[v.keyName]"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            :maxlength="v.maxlength"
                            :clearable="v.clearable"
                            :placeholder="
							v.placeholder
								? v.placeholder
								: v.flag
								? '只允许输入数字、字母、- 或_'
								: v.flagNum
								? '只允许输入数字'
								: v.flagNumInt
								? '只允许输入数字'
								: v.flagName
								? '只允许输入数值、字母、汉字、-或_'
								: v.flagLocation
								? '允许输入数值、字母、 - 、_'
								: v.flagBracket
								? '只允许输入数值、字母、汉字、-、( )'
								: v.flagProductName
								? '只允许输入数值、字母、汉字、() 、-或_'
								: v.flagNumEn
								? '只允许输入数字、字母'
								: ''
							"
                            @input="
							    v.flag
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\-\_]/g,
									''
								))
								: v.flagNum
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\d(\.\d{0,4})?$]/g,
									''
								))
								: v.flagNumInt
								? (form[v.keyName] = form[v.keyName].replace(/[^0-9]/g, ''))
								: v.flagNumFloat
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\d(\.\d{0,2})?$]/g,
									''
								))
								: v.flagName
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_]/g,
									''
								))
								: v.flagLocation
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\-\_]/g,
									''
								))
								: v.flagBracket
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_\(\)\（\）]/g,
									''
								))
								: v.flagProductName
								? (form[v.keyName] = form[v.keyName].replace(
									/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\_\(\)\（\）]/g,
									''
								))
								: v.flagNumEn
								? (form[v.keyName] = form[v.keyName].replace(
									/[^a-zA-Z0-9]/gi,
									''
								))
								:form[v.keyName]
							"
                            @keyup.enter.native="(event)=>{
                                handleSearch({
                                    detail:{
                                        keyName:v.keyName,
                                        event:event
                                    }
                                })
                            }"
                        >
                            <el-button v-if="v.slot && v.slot.type=='button'" :slot="v.slot.append" :icon="v.slot.icon" @click="()=>{
								if(v.slot.method){
									v.slot.method({
										detail:{
											keyName:v.keyName
										}
									});
								}else{
									inputSlotClick({
										detail:{
											keyName:v.keyName
										}
									})
								}
							}"></el-button>
							<template v-if="v.slot && v.slot.type=='text'" :slot="v.slot.append">{{v.slot.text}}</template>
                        </el-input>
                    </div>
                    <!--数字类型输入框-->
                    <div v-else-if="v.type === 'number'" class="input-box">
                        <el-input-number
                            style="width: 100%"
                            v-model="form[v.keyName]"
                            :min="v.minNum || v.maxNum == 0 ? v.minNum : 0"
                            :max="v.maxNum || v.maxNum == 0 ? v.maxNum : 9999999"
                            :precision="v.precision ? v.precision : 0"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            @blur="blur(v.keyName)"
                            @change="(value)=>{
								numberInputChagne({
									detail:{
										keyName:v.keyName,
										value:value
									}
								})
							}"
                        ></el-input-number>
                    </div>
                    <!-- 文件上传类型 -->
                    <div v-else-if="v.type === 'upload'" class="input-box">
                        <el-upload
                            class="upload-demo"
                            :headers="header"
                            :action="uploadFileUrl"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            :on-preview="(file) => {handleFileDownload(file, v.keyName);}"
                            :on-remove="(file, fileList) => {handleFileRemove(file, fileList, v.keyName);}"
                            :file-list="form['fileList']"
                            :limit="4"
                            :on-success="(response, file, fileList) => {uploadFileSuccess(response, file, fileList, v.keyName);}"
                            list-type="text"
                        >
                            <el-button size="small" type="primary">选择文件</el-button>
                        </el-upload>
                    </div>

                    <!-- 下拉选择框 -->
                    <div v-else-if="v.type === 'select'" class="input-box">
                        <el-select
                            v-model="form[v.keyName]"
                            :ref="v.keyName"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            reserve-keyword
                            :remote="v.remote != undefined? v.remote: false"
                            :filterable="v.filterable != undefined? v.filterable: false"
                            :clearable="v.clearable != undefined? v.clearable: false"
                            :multiple="v.multiple != undefined? v.multiple: false"
                            :allow-create="v.allowCreate != undefined? v.allowCreate: false"
                            @clear="()=>{
                                selectClear({
                                    detail:{
                                        keyName:v.keyName,
                                        list:v.list,
                                        fieldsText:v.fieldsText,
                                        fieldsValue:v.fieldsValue
                                    }
                                })
                            }"
                            :placeholder="v.placeholder || $t('table.selectPlaceholder')"
                            :remote-method="
                                    (value) => {
                                        if(v.remoteMethod){
                                            v.remoteMethod({
                                                detail:{
                                                    value:value,
                                                    keyName:v.keyName
                                                }
                                            });
                                        }else{
                                            remoteMethod({
                                                detail:{
                                                    value:value,
                                                    keyName:v.keyName
                                                }
                                            })
                                        }
                                    }
                                "
                            style="width: 100%"
                            @change="(value)=>{
								if(v.change){
									v.change({
										detail:{
											value:value,
											keyName:v.keyName
										}
									});
								}else{
									selectChange({
										detail:{
											value:value,
											keyName:v.keyName,
                                            list:v.list,
                                            item: v
										}
									})
								}
							}"
                            @focus="selectFocus(v.keyName, v)"
                            @blur="selectBlur(v.keyName,v)"
                            no-data-text="暂无数据"
                        >
                            <el-option
                                v-for="(item) in v.list"
                                v-if="item != null"
                                :key="item.id"
                                :label="v.fieldsText ? item[v.fieldsText] : item.label"
                                :value="v.fieldsValue ? item[v.fieldsValue] : item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <!--dialog模态框类型-->
                    <div v-else-if="v.type === 'dialog'" class="input-box">
                        <div v-show="isDisabled & v.disabled">
                            <el-input
                            :value="v.keyName | spliceField(form)"
                            :placeholder="v.keyName | spliceField(form)"
                            disabled
                            >
                                <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="openDialog(false, v.keyName)"
                                    :style="{ cursor: v.disabled ? 'no-drop' : '' }"
                                ></el-button>
                            </el-input>
                        </div>
                        <div v-show="!(isDisabled & v.disabled)">
                            <el-input v-model="form[v.keyName]" disabled>
                                <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="openDialog(v.disabled, v.keyName)"
                                ></el-button>
                            </el-input>
                        </div>
                    </div>
                    <!--开关类型-->
                    <div v-else-if="v.type === 'switch'" class="input-box">
                        <el-switch
                            v-model="form[v.keyName]"
                            active-value="1"
                            inactive-value="0"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                        ></el-switch>
                    </div>

                    <!--单选类型-->
                    <div v-else-if="v.type === 'radio'" class="input-box">
                        <el-radio-group
							v-model="form[v.keyName]"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
							@change="(value)=>{
								radioChange({
									detail:{
										value:value,
										keyName:v.keyName
									}
								})
							}"
						>
							<el-radio
								v-for="(item, index) in v.list"
								:key="index"
								:label="item[v.fieldsValue] || item.value"
							>
								{{ item[v.fieldsText] || item.label }}
							</el-radio>
                        </el-radio-group>
                    </div>

                    <div v-else-if="v.type === 'checkbox'" class="input-box">
                        <el-checkbox-group
							v-model="form[v.keyName]"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
							@change="(value)=>{
								checkboxChange({
									detail:{
										value:value,
										keyName:v.keyName
									}
								})
							}"
						>
							<el-checkbox
								v-for="(item, index) in v.list"
								:key="index"
								:label="item[v.fieldsValue] || item.value"
							>
								{{ item[v.fieldsText] || item.label }}
							</el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <!--复选类型-->
                    <div v-else-if="v.type === 'check'" class="input-box">
                        <el-checkbox v-model="form[v.keyName]" :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled">{{ v.name }}</el-checkbox>
                    </div>
                    <!--自定义时间类型-->
                    <div v-else-if="v.type === 'date'" class="input-box">
                        <el-date-picker
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            v-model="form[v.keyName]"
                            :type="v.field"
                            style="width: 100%"
                            :value-format="v.valueFormat || v.format || 'yyyy-MM-dd HH:mm:ss'"
                            placeholder="选择日期时间"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
                            :default-value="v.defaultValue"
                            :picker-options="pickerOptions"
                            @change="(value)=>{
                                dateChange({
                                    detail:{
                                        value:value,
                                        keyName:v.keyName
                                    }
                                })
                            }"
                        ></el-date-picker>
                    </div>

                    <!--时刻类型(时分秒)-->
                    <div v-else-if="v.type === 'time'" class="input-box">
                        <el-time-picker
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                            v-model="form[v.keyName]"
                            type="datetime"
                            value-format="HH:mm:ss"
                            style="width: 100%"
                            placeholder="选择日期时间"
                        ></el-time-picker>
                    </div>

                    <!--textarea类型-->
                    <div v-else-if="v.type === 'textarea'" class="input-box">
                        <el-input
                            :style="textareaStyle"
                            type="textarea"
                            :autosize="autosize"
                            :maxlength="v.maxlength ? v.maxlength : 200"
                            :placeholder="v.memoLimit"
                            v-model="form[v.keyName]"
                            :disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
                        ></el-input>
                    </div>

                    <!--树状图级联选择器类型-->
                    <div v-else-if="v.type === 'tree'" class="input-box">
                        <el-cascader
                            style="display:block"
							v-model="form[v.keyName]"
                            :placeholder="v.placeholder || $t('table.selectPlaceholder')"
							:options="v.list"
							:ref="v.keyName"
                            :filterable="v.filterable"
                            :filter-method="v.filterMethod"
							clearable
							:props="v.props"
                            :collapse-tags="v.collapseTags"
							:disabled="(v.disabled && isEditStatus) || v.disabledImportant || isDisabled"
							@change="
                            (query) => {
                                cascaderChagne({
                                    detail: {
                                        props:v.props,
                                        value: query,
                                        keyName:v.keyName
                                    },
                                });
                            }
                        "
                        ></el-cascader>
                    </div>
                    <div v-else-if="v.type==='buttons'" class="input-box">
                        <div class="button-group" :class="[v.align=='left'?'flex-start':'',v.align=='right'?'flex-end':'',v.align=='center'?'center':'',v.className]">
                            <div class="item" v-for="(item,index) in  v.buttons" :key="index">
                                <el-button
                                    :size="item.size || 'small'"
                                    :type="item.type || 'primary'"
                                    :plain="item.plain || false"
                                    :disabled="item.disabled || false"
                                    :icon="item.icon"
                                    @click="()=>{
                                        buttonClick(item.method)
                                    }"
                                >{{item.label}}</el-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="v.subText" class="subCon" style="padding-left:10px;">
                        {{v.subText}}
                    </div>
                </el-form-item>
            </template>
            <!-- </div> -->
        </el-col>
    </el-row>
</el-form>
</template>

<script>

export default {
    directives: {
        // 注册一个局部的自定义指令 v-focus
        focus: {
            // 指令的定义
            inserted: function (el) {
                // 聚焦元素
                el.children[0].focus();
            },
        },
    },
    components:{
       
    },
    props: {
        header: {
            type: Object,
            default () {
                return {
                    enctype: "multipart/form-data;charset=utf-8",
                    "X-Access-Token": this.$store.getters.token,
                };
            },
        },
        uploadFilePath: {
            type: String,
            default: "",
        },
        autosize: {
            Object,
            default: () => ({
                minRows: 2,
                maxRows: 2,
            }),
        },
        textareaStyle: {
            String,
            default: "width:100%;",
        },
        form: {
            // 表单绑定
            type: Object,
            default: () => ({}),
        },
        rules: {
            // 权限设置
            type: Object,
            default: () => ({}),
        },
        fields: {
            // 配置表单项
            type: Array,
            default: () => [],
        },
        size: {
            type: String,
            default: "medium",
        }, // 表单大小
        formRef: {
            type: String,
            default: "formRef",
        }, // 表单ref 绑定
        labelWidth: {
            type: String,
            default: "80px",
        }, // label 宽度设置
        labelPosition: {
            type: String,
            default: "right",
        },
        formMaxWidth: {
            type: String,
            default: "",
        }, //设置form表单宽度
        isShowField: {
            type: Boolean,
            default: false,
        },
        pickerOptions: {
            type: Object,
        },
        isDisabled:{
            type:Boolean,
            default:false
        },
        isEditStatus:{
            type:Boolean,
            default:true
        },
    },
    mounted() {
        this.$nextTick(() => {
            // 清空 验证信息
            this.$refs[this.formRef].clearValidate();
        });
    },
    data() {
        return {
            beginTime: this.$moment().format("YYYY-MM-DD 00:00:00"),
            endTime: this.$moment().format("YYYY-MM-DD 23:59:59"),
            tableData: [],
            childTableRows: [],
            defaultProps: {
                value: "id",

                label: "label",
                children: "children",
            },
        };
    },
    computed: {
        CTDisabled() {
            return !this.childTableRows.length;
        },
        uploadFileUrl() {
            return this.uploadFilePath || this["$lesUiPath"].uploadFile
        },
        file_list(){
            var list = [];

            if(this.form['uploadAttachment'] && this.form['uploadAttachment'].length > 0 && !this.onceRenderList){
                this.onceRenderList = true;
                this.form['uploadAttachment'].map((item)=>{
                var obj = {};
                obj.name = item.filename;
                obj.url = item.path;
                obj.response = {
                    filename:item.filename,
                    path:item.path
                };
                list.push(obj);
                })
            }
            return list
        }
    },
    methods: {
        // 富文本编辑器操作
        wangeditorSetHtml(html){
            this.$refs['wangeditor'][0].setHtml(html);
        },
        wangeditorGetHtml(){
            return this.$refs['wangeditor'][0].getHtml();
        },
        buttonClick(method){
            this.$emit('buttonClick',method)
        },
        handleInput(param){
            this.$emit("handleInput",param)
        },
        inputChange(param) {
            this.$emit("inputChange", param);
        },
		inputSlotClick(param){
			this.$emit('inputSlotClick',param)
		},
        numberInputChagne(param) {
            this.$emit("numberInputChagne",param);
        },
        blur(keyName) {
            this.$emit("blur", keyName);
        },
        clear(keyName) {
            this.$emit("clear", keyName);
        },
        inputFocus(keyName) {
            this.$emit("inputFocus", keyName);
        },
        selectChange(param) {
            this.$emit("selectChange",param);
        },
        selectFocus(val, item) {
            this.$emit("selectFocus", val, item);
        },
        selectBlur(val,item){
            // 下拉框失去焦点时，如果列表为空，重新获取列表数据
            if(!item.list.length){
                this.remoteMethod({
                    detail:{
                        value:"",
                        keyName:val,
                        from:blur
                    }
                })
            }
        },
        selectClear(param){
            this.$emit("selectClear",param)
        },
        remoteMethod(param) {
            this.$emit("remoteMethod",param);
        },
        dateChange(param){
            this.$emit("dateChange",param);
        },
        openDialog(isOpen, val) {
            if (isOpen === false) return
            if (
                !(this.isDisabled && isOpen !== true) ||
                (this.isDisabled && isOpen !== true)
            ) {
                this.$emit('openDialog', val)
            }
        },
        //单选
        radioChange(val) {
            this.$emit("radioChange", val);
        },
        //复选
        checkboxChange(val) {
            console.log('val', val)
            this.$emit("checkboxChange", val);
        },
        handleSearch(param) {
            this.$emit("handleSearch", param);
        },
        cascaderChagne(value) {
            if(value.detail.props && value.detail.props.multiple){
                value.detail.label = this.$refs[
                    value.detail.keyName
                ][0].getCheckedNodes(true).map((item)=>{
                    return item.pathLabels
                })
            }else{
                value.detail.label = this.$refs[
                    value.detail.keyName
                ][0].getCheckedNodes(true)[0].pathLabels;
            }
            this.$emit("cascaderChagne", value);
        },
        // 表单验证
        validate(formName, callback) {
            return this.$refs[formName || this.formRef].validate(callback);
        },
        // 表单验证
        validateField(formName, props = [], callback) {
            return this.$refs[formName || this.formRef].validateField(props, callback);
        },
        clearImages(ref){
            this.$refs[ref || 'uploadFile'][0].clear();
        },
        //表单重置
        resetFields(formName) {
            this.$refs[formName || this.formRef].resetFields();
        },
        clearValidate(formName){
            this.$refs[formName || this.formRef].clearValidate();
        },
        selectListFocus(val) {
            this.$emit("selectListFocus", val);
        },
        comBoChangePage(param){
            this.$emit("comBoChangePage", param);
        },
        comboGridDbclick(param){
            this.$emit("comboGridDbclick", param);
        },
        comboGridClick(param){
            this.$emit("comboGridClick", param);
        },
        // 文件上传下载
        handleFileDownload(file, fieldNo) {
            let id = file.response.data.id;
            this.originalName = file.response.data.originalName;
            this.$api
                .download(this.$lesUiPath.downloadFile, {
                    id: id,
                })
                .then((result) => {
                    let url = window.URL.createObjectURL(new Blob([result]));
                    let link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    link.setAttribute("download", this.originalName);
                    document.body.appendChild(link);
                    link.click();
                    this.$message.success("下载成功");
                });
        },
        //文件上传删除
        handleFileRemove(file, fileList, fieldNo) {
            this.$emit("handleFileRemove", {
                file: file,
                fileList: fileList,
                fieldNo: fieldNo,
            });
        },
        //文件上传成功
        uploadFileSuccess(response, file, fileList, fieldNo) {
            this.$emit("uploadFileSuccess", {
                res: response,
                file: file,
                fileList: fileList,
                fieldNo: fieldNo,
            });
        },
        //文件上传成功
        onSuccess(param){
        this.$emit("onSuccess",param);
        },
        //查找框选中
        studentSelect() {

        },
        // 清除级联框选中状态
        clearCascader(ref){
            this.$refs[ref][0].$refs.panel.clearCheckedNodes();
            this.$refs[ref][0].$refs.panel.activePath = [];
        }
    },
    watch: {
        "form.packSize": {
            handler(newVal, oldVal) {},
        },
    },
};
</script>

<style scoped lang="scss">
.tableBorder {
    border: 1px solid #e8eaec;
}

.headerCellClass {
    background-color: #ffffff;
    border-top: 1px solid black;
    border-left: 1px solid black;
    font-size: 7.5px;
}

.bodyCellClass {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    font-size: 6.5px;
}

.lastRight {
    background-color: #ffffff;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    font-size: 7.5px;
}

.allBorder {
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    font-size: 6.5px;
}

.table-wrap {
    /* margin-bottom: 20px; */
    /* border: 1px solid #dcdfe6; */
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(223, 223, 223, 1) !important;
    border-radius: 5px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(223, 223, 223, 1) !important;
    -webkit-box-shadow: inset006pxrgba(223, 223, 223, 1) !important;
}

::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(223, 223, 223, 1);
}

/deep/.el-form-item {
    margin-bottom: 20px !important;
}

.add {
    float: right;
    margin-top: -35px;
}

.remove {
    float: right;
    margin-top: -35px;
    margin-left: 30px;
}

.input-box i {
    /* display: inline-block; */
    font-size: 1;
    width: 18px;
    color: #002a5d;
}

.my-xtable-element .vxe-table--footer-wrapper {
    overflow: hidden;
    margin-top: 0 !important;
}

.vxe-pager--left-wrapper {
    float: left;
}

.vxe-input .vxe-input--suffix {
    top: 0.3em;
}
.button-group{
    .item+.item{
        margin-left:10px;
    }
    &.flex-end{
        display:flex;
        align-items: center;
        justify-content: flex-end;
    }
    &.flex-start{
        display:flex;
        align-items: center;
        justify-content: flex-start;
    }
    &.center{
        display:flex;
        align-items: center;
        justify-content: center;
    }
}
.el-row {
    width:100%;
}
</style>
