<template>
<div :class="['table',className]">
    <el-table
        :class="className"
        v-loading="tableLoading"
        :data="tableData"
        ref="dataTable"
        element-loading-text="加载中，请稍等..."
        border
        @header-dragend="headerDragend"
        fit
        :height="height"
        :maxHeight="maxHeight ||copyMaxHeight"
        :style="{ width: '100%', positon: 'relative' }"
        @selection-change="getSelection"
        @select="select"
        @row-dblclick="doubleClick"
        @row-click="getRowData"
        :row-style="rowStyle"
        :stripe="stripe"
        :highlight-current-row="highlightCurrentRow"
        :default-expand-all="defaultExpandAll"
        @current-change="handleCurrentChange"
        :cell-class-name="tableCellClassName"
        :row-class-name="rowClassName"
        :header-cell-style="headerCellStyle"
        :cell-style="{ height: '40px', boxSizing: 'border-box', padding: '0px' }"
        :row-key="rowKey"
        :lazy="lazy"
        :load="childrenLoad"
        :tree-props="treeProps"
        :show-summary="showSummary"
        :summary-method="getSummaries"
        @sort-change="sortChange"
    >
        <el-table-column
            v-if="isShowSelection"
            type="selection"
            :selectable="selectable"
            width="40"
            :fixed="fixed['selection']"
            :prop="sortCollumn == 'selection'?sortProp:''"
            :reserve-selection="reserveSelection"
        />
         <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50"
            v-if="isShowSeq"
            :fixed="fixed['seq']"
            :prop="sortCollumn == 'index'?sortProp:''"
        >
        </el-table-column>
        <el-table-column
            v-for="(item, key) in tableHead"
            :key="key"
            :width="item.fixWidth"
            :min-width="(item.fieldType == 'date' && headerQuery && item.isNeed =='1')?280:(Number(item.width)+25)"
            :prop="item.fieldNo"
            :label="tableHeadLabel(item)"
            :align="item.align || 'center'"
            :fixed="fixed[item.fieldNo]"
        >
            <template slot-scope="scope">
                <template v-if="(scope.row.uploadAttachment && item.fieldNo == 'uploadAttachment') || (scope.row.bomDrawing && item.fieldNo == 'bomDrawing')">
                    <a style="color:#1890ff;text-decoration:underline;cursor:pointer" @click.stop="()=>{
                            previewImages(scope.row, item.fieldNo)
                        }">查看文件</a>
                </template>
                <template v-else-if="(scope.row.images && item.fieldNo == 'images')">
                    <img style="height:60px;width:80%;" :src="Array.isArray(scope.row.images)?scope.row.images[0] : scope.row.images" />
                </template>
                <template v-else-if="(item.fieldNo == 'status')">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="true"
                        :inactive-value="false"
                        @change="(value)=>{
                            switchChange({
                                detail:{
                                    value:value,
                                    key: item.fieldNo,
                                    keyName:item.fieldNo,
                                    index:scope.$index,
                                    row:scope.row
                                }
                            })
                        }"
                    >
                    </el-switch>
                </template>
                 <template v-else-if="(item.fieldNo == 'createTime' || item.fieldNo == 'actBuyTime' || item.fieldNo == 'actSaleTime' || item.fieldNo == 'actBreachTime' || item.fieldNo == 'actFinishTime' || item.fieldNo == 'endBuyTime' || item.fieldNo == 'startBuyTime' || item.fieldNo == 'paidTime')"> {{scope.row[item.fieldNo] | formatDate}}</template>
                <template v-else-if="scope.row.render && item.fieldNo in scope.row.render && scope.row.render[item.fieldNo].type == 'input'">
                    {{item.fieldNo | spliceField(scope.row)}}
                </template>
                <template v-else-if="scope.row.render && item.fieldNo in scope.row.render && (scope.row.render[item.fieldNo].type == 'select' || scope.row.render[item.fieldNo].type == 'radio')">
                    {{renderSelect(scope.row,item.fieldNo)}}
                </template>
                <template v-else-if="editfields && item.fieldNo in editfields && editfields[item.fieldNo].view == 'input'">
                    {{item.fieldNo | spliceField(scope.row)}}
                </template>
                <template v-else-if="editfields && item.fieldNo in editfields && (editfields[item.fieldNo].type == 'select' || editfields[item.fieldNo].type == 'radio')">
                    {{renderSelect(scope.row,item.fieldNo)}}
                </template>
                <template v-else>{{scope.row[item.fieldNo] }}</template>
            </template>
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
            align="center"
            :width="buttonCellWidth"
            v-if="buttons['list'].length"
        >
            <template slot-scope="scope">
                <template v-for="(item, index) in buttons['list']">
                    <div
                        :key="index"
                        v-if="(item.role ? $hasPm(item.role) : true) && (item.if ? isShowBtn(item.if, scope.row) : true)"
                        class="button-inline-block"
                    >
                        <template v-if="item.popover">
                            <el-popover
                                placement="bottom"
                                trigger="click"
                                v-if="$hasPm(item.role) && item.if ? isShowBtn(item.if, scope.row) : true"
                            >
                                <div class="btnMore">
                                    <div v-for="(child, index) in item['list']" :key="index">
                                        <el-button
                                            :type="child.type || 'text'"
                                            :size="child.size || 'small'"
                                            :class="child.class"
                                            :icon="child.icon || ''"
                                            @click="handleOperation({ row: scope.row, type: child.method,index:scope.$index})"
                                            v-if="(child.role ? $hasPm(child.role) : true) && (child.if ? isShowBtn(child.if, scope.row) : true)"
                                        >{{ child.label }}</el-button>
                                    </div>
                                </div>
                                <el-button
                                    type="text"
                                    size="small"
                                    class="edit"
                                    slot="reference"
                                    style="margin-left: 8px"
                                >
                                    更多
                                </el-button>
                            </el-popover>
                        </template>
                        <template v-else>
                            <el-button
                                :type="item.type || 'text'"
                                :size="item.size || 'small'"
                                :class="item.class"
                                :icon="item.icon || ''"
                                @click="handleOperation({ row: scope.row, type: item.method ,method: item.method ,index:scope.$index})"
                            >{{ item.label }}</el-button>
                        </template>
                    </div>
                </template>
            </template>
        </el-table-column>
    </el-table>
    <div class="tablePagination">
        <div class="page-slot">
            <slot name="page-slot" />
        </div>
        <el-pagination
            v-show="isShowPage"
            :page-sizes="pageSizes"
            :current-page="currentPage"
            :page-size="currentSize"
            :total="total"
            class="pagination"
            align="right"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="currentChange"
        />
    </div>
</div>
</template>

<script>
import { formatDate } from "@/utils/date"
export default {
    name: "Index",
    props: {
        // 
        subAssociationField: {
            type: Array,
            default: () => [],
        },
        // 是否开启头部筛选
        headerQuery:{
            type:Boolean,
            default:false
        },
        sortable:{
            type:[Boolean,String],
            default:true
        },
        sortCollumn:{
            type:String,
            default:''
        },
        sortProp:{
            type:String,
            default:''
        },
        formSize: {
            type: String,
            default: 'small'
        },
        // 是否开启行编辑
        rowEdit: {
            type: Boolean,
            default: false
        },
        pickerOptions: {
            type: Object,
            default: () => {
                return {};
            }
        },
        editfields: {
            type: Object,
            default: () => {
                return {};
            }
        },
        fixed:{
            type:Object,
            default: () => {
                return {};
            }
        },
        highlightCurrentRow:{
            type:Boolean,
            default:false
        },
        defaultExpandAll:{
            type:Boolean,
            default:false
        },
        buttons: {
            type: Object,
            default: () => {
                return {
                    list: []
                };
            },
        },
        tableData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        tableHead: {
            type: Array,
            default: () => {
                return [];
            },
        },
        selectData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        pageSizes: {
            type: Array,
            default: () => {
                return [5, 10, 20, 30, 40, 100];
            },
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        currentSize: {
            type: Number,
            default: 5,
        },
        total: {
            type: Number,
            default: 0,
        },
        width: {
            type: String,
            default: "",
        },
        tableLoading: {
            type: Boolean,
            default: false,
        },
        isShowPage: {
            type: Boolean,
            default: true,
        },
        isShowSelection: {
            type: Boolean,
            default: true,
        },
        isShowRadio: {
            type: Boolean,
            default: false,
        },
        isShowSeq: {
            type: Boolean,
            default: true
        },
        maxHeight: {
            type: [Number, String],
            default: null,
        },
        diffHeight:{
            type: [Number, String],
            default: 260, //此高度为clientHeight与表格高度的差值
        },
        viewNo: {
            type: String,
            default: "",
        },
        cssSetHeight: { //通过css控制高度
            type: Boolean,
            default: false
        },
        buttonCellWidth:{
            type: [Number, String],
            default: 170, //操作列的宽度
        },
		height: {
			type: String,
			default: null
		},
		stripe: {
			type: Boolean,
			default: true
		},
        className:{
            type: [String,Array],
			default: ""
        },
        rowKey:{
            type: [String,Function],
			default: ""
        },
        reserveSelection:{
            type: Boolean,
            default: false
        },
        showHeaderBtn:{
            type: Boolean,
            default: false
        },
        lazy:{
            type: Boolean,
            default: true
        },
        dialogWidth:{
            type: String,
            default: '25%'
        },
        treeProps:{
            type:Object,
            default(){
                return {children: 'childrenList', hasChildren: 'hasChildren'}
            }
        },
        showSummary:{
            type: Boolean,
            default: false
        },
        fieldTab:{
            type: Boolean,
            default: false
        },
        // 表格数据变化后是否清除选择项
        dataChangeClearSelection:{
            type:Boolean,
            default:true
        }
    },
    computed:{
        tableHeadLabel(){
            return (item)=>{
                let label = item.fieldChName? item.fieldChName : item.fieldName;
                label = this.lang=='EN'?item.fieldEnName?item.fieldEnName:label:label;
                return label;
            }
            
        }
    },
    components:{
       
    },
    data() {
        return {
            // 顶部搜搜参数
            headerQueryParams:{
                queryHeadList:[],
                page:1
            },
			previewFileList:[],
			dialogFileVisible:false,
            isChangeDisabled: false,
            viewName: "components.CustomTable",
            fullHeight: 0,
            tableHeight: 0,
            isSort: true,
            copyTableHead: [],
            copyMaxHeight: 'auto',
            radio: 0,
        };
    },
    filters:{
      formatDate(time) {
        let date = new Date(time*1);
        return time?formatDate(date, 'yyyy-MM-dd hh:mm:ss'):''
      }
    },
    mounted() {
        this.$table = this.$el;
        if (!this.cssSetHeight) {
            this.$nextTick(() => {
                this.setTableHeight(document.body.clientHeight - this.diffHeight);
            });
            window.addEventListener('resize',this.onResize,false);
        }
        // this.drag();
    },
	beforeDestroy(){
		window.removeEventListener('resize',this.onResize);
	},
    methods: {
        sendHeaderQuery(){
            this.headerQueryParams.viewNo = this.viewNo;
            this.tableHead.map(x => {
                x.headerFilter = false
            })
            this.headerQueryParams.queryHeadList.length>0 && this.headerQueryParams.queryHeadList.map(v=>{
                this.tableHead.map((x,k)=>{
                    if(v.columnName == x.tableField || v.columnNameCopy == x.tableField){
                        x.headerFilter = true
                    }
                })
            })
            this.$emit('sendQuery',this.headerQueryParams)
            // this.$api.post(globalData.baseUrl + '/view/condition/setQuery', this.headerQueryParams).then((result) => {
            //     if (result.code == 0) {
            //         this.$emit('sendQuery',this.headerQueryParams)
            //     }
            // })
        },
        tableCellClassName({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            //注意这里是解构
            //利用单元格的 className 的回调方法，给行列索引赋值
            row.$index = rowIndex;
            column.$index = columnIndex;
            var className = "";
            this.$emit("tableCellClassName",{row,column,rowIndex,columnIndex},(val)=>{
                className = val;
            })
            return className;
        },
        rowClassName({row,rowIndex}){
            var className = "";
            this.$emit("rowClassName",{row,rowIndex},(val)=>{
                className = val;
            })
            return className;
        },
        selectable(row,index){
            return row.selectable != undefined?row.selectable:true;
        },
        isShowBtn(fun, param) {
            return fun(param);
        },
        fieldIsEdit(fun,param){
            return fun(param);
        },
        onResize(){
			window.fullHeight = document.body.clientHeight;
			this.tableHeight = window.fullHeight - this.diffHeight;
			this.setTableHeight(this.tableHeight);
		},
        setTableHeight(tableHeight) {
            this.$table.querySelector(".el-table__body-wrapper").style.height = tableHeight + 'px';
			this.$table.querySelector(".el-table__body-wrapper").style.overflow = 'auto';
			this.copyMaxHeight = tableHeight + 10 + 'px';
			this.$emit('update:maxHeight', this.copyMaxHeight);
        },
        headerCellStyle(row, index) {
            return {
                boxSizing: "border-box",
                height: "45px",
                padding: "0px",
                background: "#FAFAFA",
                color: "#002a5d",
                fontWeight: "normal",
            };
        },
        rowStyle(row) {
            let style = {};
        },
        sizeChange(val) {
            this.$emit("sizeChange", val);
        },
        currentChange(val) {
            this.$emit("currentChange", val);
        },
        getSelection(val) {
            this.$emit("getSelection", val);
        },
        select(selection, row){
            var param = {
                selections:selection,
                row:row,
                checked:false
            };
            for(var i = 0;i<selection.length;i++){
                if(selection[i].$index == row.$index){
                    param.checked = true;
                    break;
                }
            }
            this.$emit('select',param);
        },
        getCurrentRow(val) {
            this.$emit("getCurrentRow", val);
        },
        getRowData(val) {
            this.$emit("getRowData", val);
        },
        doubleClick(row) {
            if (this.rowEdit) {
                this.$emit('doubleClick', row);
                if (!row.render || row.NEED_UPDATE_RENDER) {
                    //row.render = this.$global.deepClone(this.editfields);
                    this.$set(row,'render',this.$global.deepClone(this.editfields));
                    if(row.NEED_UPDATE_RENDER){
                        row.NEED_UPDATE_RENDER = false;
                        try{
                            delete row.NEED_UPDATE_RENDER;
                        }catch(error){
                            console.log(error)
                        }
                    }
                }
                !row.EDIT && this.$emit('editActive', row);
                row.EDIT = true;
                this.$forceUpdate();
            } else {
                this.$emit('handleUpdate', row);
            }
        },
        previewImage(list) {
            this.$emit("previewImage", list);
        },
		previewImages(row, fieldNo){
			this.previewFileList = [];
			// var list = JSON.parse(row.uploadAttachment);
            var list = [];
            if(fieldNo == 'uploadAttachment') {
                list = row.uploadAttachment
            }else if(fieldNo == 'bomDrawing') {
                list = row.bomDrawing
            }
			if(typeof list == 'string'){
				list = list.split(",");
			}
			var arr = list.map((item)=>{
				var json = {};
				if(typeof item == "string"){
					item = item.split("|");
				}
				json.name =  item[0];
				json.url = item[1];
				json.response = {
					path:item[1],
					filename:item[0]
				}
				return json;
			})
			this.previewFileList = arr;
			this.dialogFileVisible = true;
		},
		handlePreviewFile(file){
            const that = this;
            let originalName = file.response.filename;
            let url = this.$lesUiPath.TXdownloadFile+'?fileUrl='+file.response.path;
            download(url,originalName);
            /**
             * 获取 blob
             * @param  {String} url 目标文件地址
             * @return {Promise} 
             */
            function getBlob(url) {
                return new Promise(resolve => {
                    const xhr = new XMLHttpRequest();

                    xhr.open('GET', url, true);
                    xhr.responseType = 'blob';
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        }
                    };

                    xhr.send();
                });
            }
            /**
             * 保存
             * @param  {Blob} blob     
             * @param  {String} filename 想要保存的文件名称
             */
            function saveAs(blob, filename) {
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
                } else {
                    const link = document.createElement('a');
                    const body = document.querySelector('body');

                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;

                    // fix Firefox
                    link.style.display = 'none';
                    body.appendChild(link);
                    
                    link.click();
                    body.removeChild(link);

                    window.URL.revokeObjectURL(link.href);
                    
                    that.$message.success("下载成功");
                }
            }
            /**
             * 下载
             * @param  {String} url 目标文件地址
             * @param  {String} filename 想要保存的文件名称
             */
            function download(url, filename) {
                getBlob(url).then(blob => {
                    saveAs(blob, filename);
                });
            }
        },
        //行内date
        dateChange(param){
            this.$emit("dateChange",param);
        },
        // 行内input
        rowInputChange(param) {
            this.$emit("rowInputChange", param);
        },
        rowInputFocus(param){
            this.$emit("rowInputFocus", param);
        },
        inputSlotClick(param){
            this.$emit("inputSlotClick", param);
        },
        // 查找
        comboGridFocus(param){
            this.$emit("comboGridFocus", param);
        },
        // 行内select
        rowSelectChange(param) {
            this.$emit("rowSelectChange", param);
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
        //
        rowRadioChange(param){
            this.$emit("rowRadioChange", param);
        },
        rowCheckboxChange(param){
            this.$emit("rowCheckboxChange", param);
        },
        rowSelectFocus(param){
            this.$emit("rowSelectFocus", param);
        },
        rowRemoteMethod(param) {
            this.$emit("rowRemoteMethod", param);
        },
        // 行内inputNumber
        rowInputNumberChange(param) {
            this.$emit("rowInputNumberChange", param);
        },
        renderSelect(row, fieldNo) {
            var name,render,model;
            if(row.render){
                render = row.render[fieldNo];
            }else{
                render = this.editfields[fieldNo];
            }
            model = render.fieldNo || fieldNo;
            if(!(model in row)){
                name = this.$global.filterFields[model];
                if(name){
                    var arr = [];
                    (`${name}Code` in row) && arr.push(row[`${name}Code`]);
                    (`${name}Name` in row) && arr.push(row[`${name}Name`]);
                    this.$set(row,model,arr.join("-"));
                }
            }
            var list = render.list;
            var key = render.fieldValue || 'value';
            var value = render.fieldLabel || 'label';
            var result = "";
            var array = [];
            var temp = row[model]?typeof row[model] == 'object'?row[model]:row[model].split(","):[];
            temp.forEach((item)=>{
                for (var i = 0; i < list.length; i++) {
                    if (item == list[i][key]) {
                        array.push(list[i][value]);
                        break;
                    }
                }
            })
            result = array.join(",");
            return result || (typeof row[model] == 'object'?row[model].join(","):row[model]);
        },
        sortTable(sort){
            this.$refs['dataTable'].sort(sort.prop,sort.order);
        },
        clearSelection(){
            this.$refs['dataTable'].clearSelection();
        },
        toggleRowSelection(row,selected){
            this.$refs['dataTable'].toggleRowSelection(row,selected);
        },
        toggleAllSelection() {
            this.$refs['dataTable'].toggleAllSelection()
        },
        handleCurrentChange(currentRow, oldCurrentRow){
            this.$emit("tableCurrentChange",currentRow, oldCurrentRow)
        },
        //操作
        handleOperation(val) {
            this.$emit("handleOperation", val);
        },
        handleHeaderClick(val) {
            this.$emit("handleHeaderClick", val)
        },
        headerDragend(newWidth, oldWidth, column, event) {
            // this.tableHead.map((item) => {
            //     if (item.fieldNo == column.property) {
            //         getUpdateWidth({
            //             id: item.id,
            //             width: parseInt(newWidth),
            //         }).then((result) => {
            //             if (result.status == 200) {
            //                 // console.log(result)
            //             }
            //         });
            //     }
            // });
        },
        //拖拽表格排序
        drag() {
            var that = this;
            const el = document.querySelectorAll(
                ".el-table__header-wrapper > table tr"
            )[0];
            this.sortAble = Sortable.create(el, {
                direction: "horizontal",
                draggable: ".allowdrag", //指定那些选项需要排序
                onEnd: (evt) => {
                    that.copyTableHead = that.tableHead;
                    if (this.isShowSelection) {
                        that.copyTableHead.splice(
                            evt.newIndex - 2,
                            0,
                            that.copyTableHead.splice(evt.oldIndex - 2, 1)[0]
                        );
                        var newArray = that.copyTableHead.slice(0);
                        that.copyTableHead = [];
                        that.$nextTick(function () {
                            that.copyTableHead = newArray;
                            that.$emit("update:tableHead", that.copyTableHead);
                            let rowObj = {
                                id: that.copyTableHead[evt.newIndex - 2].id,
                                newSort: evt.newIndex - 1,
                                sort: evt.oldIndex - 1,
                                viewNo: that.viewNo,
                            };
                            getUpdateSort(rowObj);
                        });
                    } else {
                        that.copyTableHead.splice(
                            evt.newIndex - 1,
                            0,
                            that.copyTableHead.splice(evt.oldIndex - 1, 1)[0]
                        );
                        var newArray = that.copyTableHead.slice(0);
                        that.copyTableHead = [];
                        that.$nextTick(function () {
                            that.copyTableHead = newArray;
                            that.$emit("update:tableHead", that.copyTableHead);
                            let rowObj = {
                                id: that.copyTableHead[evt.newIndex - 1].id,
                                newSort: evt.newIndex,
                                sort: evt.oldIndex,
                                viewNo: that.viewNo,
                            };
                            getUpdateSort(rowObj);
                        });
                    }
                },
            });
        },
        //表格默认选中
        getSelectDefault(row) {
            this.$refs.dataTable.toggleRowSelection(row, true);
        },
        //表格子行懒加载
        childrenLoad(tree, treeNode, resolve) {
            this.$emit('childrenLoad',tree, treeNode, resolve)
        },
        clearTableSelection(){
            this.radio = ''
            this.$refs.dataTable.clearSelection()
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            let list=[]
            /****取出type为number类型的数据集合***** */
            data.map(item=>{
                this.tableHead.map(itm=>{
                    if(itm.fieldType === 'number' && itm.fieldNo == column.property){
                        list.push(Number(item[column.property]))
                    }
                })
            })
            if (!list.every(value => isNaN(value))) {
                sums[index] = list.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return getSum(prev , curr);
                } else {
                    return prev;
                }
                }, 0);
            }
            });
            /**重新布局表格*** */
            this.$nextTick(()=>{
                this.$refs.dataTable.doLayout();
            })
            return sums;
        },
        //远程排序
        sortChange(param){
            if(this.sortable == 'custom') {
                this.$emit("sortChange",param)
            }
        },
        //切换选择行
        setCurrentRow(row) {
            this.$refs.dataTable.setCurrentRow(row);
        },
        switchChange(param){
            this.$emit("switchChange",param)
        }
    },
    watch: {
        tableHead:{
            handler(){
                this.$nextTick(()=>{
                    this.$refs['dataTable'].doLayout();
                })
            }
        },
        fullHeight(val, oldVal) {
            if (!this.timer) {
                this.fullHeight = val;
                this.tableHeight = this.fullHeight - 0;
                document
                    .getElementsByClassName("table")[0]
                    .getElementsByClassName("el-table__body-wrapper")[0].style.height =
                    this.tableHeight * 0.98 + "px";
                document
                    .getElementsByClassName("table")[0]
                    .getElementsByClassName("el-table__body-wrapper")[0].style.overflow =
                    "auto";
                this.timer = true;
                let that = this;
                setTimeout(function () {
                    that.timer = false;
                }, 400);
            }
        },
        copyTableHead(newVal, oldVal) {
            this.$emit("update:tableHead", newVal);
        },
        tableData(){
            if(this.dataChangeClearSelection){
                this.$emit('getSelection', []);
			    this.$refs.dataTable.clearSelection()
            }
		},
    },
};
</script>

<style lang="scss" scoped>
.button-inline-block {
    display: inline-block;
}

.button-inline-block+.button-inline-block {
    margin-left: 10px;
}

.page-slot {
    font-size: 14px;
    line-height: 36px;
}

.table {
    // padding: 0 0 10px;
    background-color: #f0f2f5;
    // box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

    //滑动样式
    ::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        box-shadow: inset12pxrgba(223, 223, 223, 1) !important;
        border-radius: 5px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(223, 223, 223, 1) !important;
        box-shadow: inset12pxrgba(223, 223, 223, 1) !important;
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background-color: rgba(223, 223, 223, 1);
    }

    .edit {
        color: #1890ff;
    }

    .delete {
        color: #e32929;
    }

    .el-table__fixed-body-wrapper {
        top: 45px !important;
    }

    .el-table__body tr.current-row>td {
        background-color: #b3cff4;
    }

    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
        background-color: #b3cff4;
        border: 1px solid gainsboro;
    }

    .tablePagination {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 0;
    }
}
.table.flex {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /deep/.el-table {
        flex: 1;
        display:flex;
        flex-direction: column;
        .el-table__body {
            table-layout: fixed;
        }
        .el-table__body-wrapper{
            flex:1;
        }
        .el-table__fixed-body-wrapper{
            bottom:0;
        }
    }
}
/deep/.el-input__inner{
    text-align: inherit;
}
.el-table__empty-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.btnMore {
    .el-button--text {
        margin-left: 10px;
    }
}

.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .el-pager li {
    color: rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
}

.el-pagination.is-background .btn-prev:disabled,
.el-pagination.is-background .btn-next:disabled {
    color: rgba(0, 0, 0, 0.25);
}
.dialog-file-list {
    display: flex;
    align-items: flex-start;

    .label {
        line-height: 25px;
    }

    /deep/.list {
        flex: 1;

        .el-upload {
            display: none;
        }

        .el-upload-list__item {
            margin-top: 0;
        }
    }
}
.showHeaderBtn {
    margin-left: 10px;
    cursor: pointer;
    :hover {
        color: #1890ff;
    }
}
</style>
