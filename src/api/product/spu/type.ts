//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number;
    message: string;
    ok: boolean;
}

//SPU数据的ts类型
export interface SpuData {
    id?: number;
    spuName: string;
    description: string;
    category3Id: number|string;
    tmId: number|string;
    spuImageList: null|SpuImg[];
    spuSaleAttrList: null|SaleAttr[];
}

//数组：元素都是已有SPU数据的ts类型
export type Records = SpuData[];

//定义获取已有的SPU接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records;
        total: number;
        size: number;
        current: number;
        pages: number;
        searchCount: boolean;
    };
}

//品牌数据的ts类型
export interface Trademark {
    id?: number;
    tmName: string;
    logoUrl: string;
}

//品牌接口返回的ts数据类型
export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}

//SPU图片数据的ts类型
export interface SpuImg {
    id?: number;
    imgName?: string;
    imgUrl?: string;
    spuId?: number;
    createTime?: string;
    updateTime?: string;
    name?: string;
    url?: string;
}

//SPU图片接口返回的ts数据类型
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}

//已有的销售属性值对象的ts类型
export interface SaleAttrValue {
    id?: number;
    createTime?: string;
    updateTime?: string;
    spuId?: number;
    baseSaleAttrId: number|string;
    saleAttrName?: string;
    saleAttrValueName: string;
    isChecked?: null;
}

//存储已有的销售属性值数组ts类型
export type SpuSaleAttrValueList = SaleAttrValue[];

//销售属性对象的ts类型
export interface SaleAttr {
    id?: number;
    createTime?: string;
    updateTime?: string;
    spuId?: number;
    baseSaleAttrId: number|string;
    saleAttrName: string;
    spuSaleAttrValueList: SpuSaleAttrValueList;
    flag?: boolean;
    saleAttrValue?: string;
}

//SPU已有的销售属性接口返回数据的ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
    id: number;
    name: string;
}

export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}

export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku图片地址
}

export interface Attr {
  attrId: number|string,//平台属性ID
  valueId: number|string,//属性值ID
}
export interface saleArr {
  saleAttrId: number|string,//销售属性ID
  saleAttrValueId: number|string,
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}