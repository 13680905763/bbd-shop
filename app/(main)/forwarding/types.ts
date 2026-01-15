export interface ServiceItem {
  id: string | number;
  serviceId?: string | number;
  serviceName: string;
  price: number;
  introduction?: string;
  sample?: string[];
  stacked?: number; // 1 表示支持数量堆叠
  isCheck?: boolean;
  remark?: string;
  quantity?: number;
}

export interface ForwardingFormData {
  logisticsCode: string;
  packageItemName: string;
}
