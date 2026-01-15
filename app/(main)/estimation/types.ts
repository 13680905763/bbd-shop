export interface RouteItem {
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
