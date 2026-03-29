<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌" style="width: 250px;">
            <el-select v-model="SpuParams.tmId">
                <el-option v-for="(item) in AllTrademark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
                <!-- label:展示的数据 value:选中的数据 -->
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图标">
            <!-- v-model:file-list->展示默认图片
            action:图片上传路径 -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <!-- 展示销售属性的下拉菜单 -->
            <el-select style="width: 200px;"
                :placeholder="unSelectSaleAttr.length ? `还有${unSelectSaleAttr.length}未选择` : '无'"
                v-model="saleAttrIdAndValueName">
                <el-option v-for="(item) in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
                type="primary" size="default" icon="Plus">添加属性</el-button>
            <!-- table展示销售属性与属性值的地方
             data是展示的数据，而prop是展示数据的名称 -->
            <el-table border style="margin:10px 0px" :data="saleAttr">
                <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <!-- row即为当前SPU已有的销售属性对象 -->
                    <template #="{ row }">
                        <el-tag @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin: 0px 5px;"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                            placeholder="请你输入属性值" size="small" style="width: 80px ;"></el-input>
                        <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ $index }">
                        <el-button type="primary" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default"
                @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reqAddOrUpdateSpu, reqSpuImageList, reqAllTradeMark, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu';
import type { SaleAttrValue, AllTradeMark, HasSaleAttr, SaleAttr, SpuData, SpuHasImg, SpuImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import type { Trademark } from '@/api/product/trademark/type';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
let $emit = defineEmits(['changeScene']);
//点击取消按钮：通知父组件切换场景为0，展示已有的SPU的数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' });
}
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('');
//存储已有的SPU数据
let AllTrademark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU的销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//存储已有的SPU的图片
let dialogImageUrl = ref<string>('');
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
    category3Id: '',//收集三级分类ID
    description: '',//SPU的描述
    spuName: '',//SPU的名字
    spuImageList: [],
    spuSaleAttrList: [],
    tmId: ''//品牌的ID
});
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
    //存储已有的SPU对象，将来在模板中展示
    SpuParams.value = spu;
    //spu：即为父组件传递过来的已有的SPU数据，不完整
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    //获取整个项目全部SPU的销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();

    //存储全部品牌的数据
    AllTrademark.value = result.data;
    //存储已有的SPU图片的数据
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }//将已有的SPU图片的数据进行格式转换
    });//map()方法用于遍历数组，返回一个新的数组
    //存储已有的SPU销售属性的数据
    saleAttr.value = result2.data;
    //存储全部SPU销售属性的数据
    allSaleAttr.value = result3.data;
}

//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
    //将图片路径赋值给dialogImageUrl
    dialogImageUrl.value = file.url;
    //显示dialog
    dialogVisible.value = true;
}

//照片墙删除文件钩子
const handleRemove = (file: any) => {
    //获取已有的SPU的图片的数据
    let imgList = SpuParams.value.spuImageList as SpuImg[];
    //删除已有的SPU图片的数据
    imgList.splice(imgList.indexOf(file), 1);
}

//照片墙上传成功之前的钩子约束文件的大小与类型
/* const beforeUpload = (file: any) => {
    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 4) {
            return true;
        } else {
            ElMessage({
                message: '请上传小于4MB的图片',
                type: 'error',
            });
            return false;
        }
    } else {
        ElMessage({
            message: '请上传正确的图片格式',
            type: 'error',
        });
        return false;
    }
} */

//计算出当前SPU还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
    //全部的销售属性-已有的销售属性
    return allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName;
        });
    });
})

//添加销售属性的方法
const addSaleAttr = () => {
    //获取已有的SPU销售属性的数据
    let [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象：将来带给服务器即可
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId: Number(baseSaleAttrId),
        saleAttrName: String(saleAttrName),
        spuSaleAttrValueList: []
    };
    //追加到数组当中
    saleAttr.value.push(newSaleAttr);
    //清空输入框
    saleAttrIdAndValueName.value = '';
}

//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
    //切换为编辑模式
    row.flag = true;
    row.saleAttrValue = '';
}

//表单元素失去焦点的事件
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string),
    };
    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            message: '属性值不能为空',
            type: 'error',
        });
        return;
    }
    //判断属性值是否在数组中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })

    if (repeat) {
        ElMessage({
            message: '属性值不能重复',
            type: 'error',
        });
        return;
    }

    //追加到已有的SPU销售属性的数据当中
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}

//保存按钮的回调
const save = async () => {
    //整理数据
    //1.照片墙的数据
    //map()方法用于遍历数组，返回一个新的数组
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        console.log(item.response);
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
            //如果item.response存在且item.response.data存在，即新增的图片就返回item.response.data，否则返回item.url
        }
    });
    //整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    //发请求
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code == 200) {
        //提示成功
        ElMessage({
            message: SpuParams.value.id ? '修改SPU成功' : '添加SPU成功',
            type: 'success',
        });
        //通知父组件进行切换场景
        $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
    } else {
        //提示失败
        ElMessage({
            message: SpuParams.value.id ? '修改SPU失败' : '添加SPU失败',
            type: 'error',
        });
    }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",
        description: '',
        spuName: '',
        spuImageList: [],
        spuSaleAttrList: [],
        tmId: ''
    })
    imgList.value = [];
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
    AllTrademark.value = result.data;
    allSaleAttr.value = result1.data;
}

//对外暴露
defineExpose({
    initHasSpuData,
    initAddSpu
})
</script>

<style scoped></style>