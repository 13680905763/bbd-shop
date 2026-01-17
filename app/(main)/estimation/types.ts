export interface RouteItem {
  disable?: boolean;
  prompt?: string;
  logoUrl: string;
  templateName: string;
  shippingFee: number;
  firstWeight: number;
  firstWeightFee: number;
  additionalWeightFee: number;
  shippingLine: {
    minDays: number;
    maxDays: number;
    description: string;
    minWeight: number;
    maxWeight: number;
  };
}
