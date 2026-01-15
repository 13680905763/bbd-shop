// services/warehouseApi.ts
import { request } from "./request";
import type { PageResult } from "@/types/api";
import type {
    CreateWaybillPreviewParams,
    WarehousePackageItem,
    WarehousePackageListParams,
} from "@/types/warehouse";

export const warehouseApi = {
    /** 获取包裹分页列表 */
    listPackages(
        params: WarehousePackageListParams,
    ): Promise<PageResult<WarehousePackageItem>> {
        return request.post("/waybill/package/page", params);
    },
    /** 获取增值服务列表 */
    listServices(): Promise<any[]> {
        return request.get("/services/query?serviceLevel=2");
    },
    /** 创建运单预览（返回 previewKey） */
    createWaybillPreview(
        data: CreateWaybillPreviewParams,
    ): Promise<string> {
        return request.post("/waybill/preview/init", data);
    },
    /** 获取运单预览详情 */
    getWaybillPreview(
        previewKey: string,
    ): Promise<any> {
        return request.get(`/waybill/preview/key?key=${previewKey}`);
    },
};
