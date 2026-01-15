import { useState, useCallback, useEffect } from "react";

// 服务的类型
export interface ServiceItem {
  id: string;
  name?: string;
  price?: number;
  // 原始数据可能有的字段
  isSelected?: boolean; // 如果原始数据有，会被覆盖
  quantity?: number;    // 如果原始数据有，会被覆盖
}

// 带选择状态的服务
export interface ServiceWithSelection extends ServiceItem {
  isSelected: boolean;
  quantity: number;
}

// Hook 返回的数据结构
export interface ServiceSelectionState {
  // 你需要的渲染数据
  services: ServiceWithSelection[];

  // 修改的方法
  toggleSelection: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  // 获取选中结果（用于提交）
  getSelectedServices: () => Array<{
    serviceId: string;
    quantity: number;
    remark: string;
  }>;
}

export default function useServiceSelection(
  // 你传入的原始服务数组
  serviceList: ServiceItem[] = []
): ServiceSelectionState {
  // 内部状态：记录每个服务的选中和数量
  const [selection, setSelection] = useState<
    Record<string, { isSelected: boolean; quantity: number }>
  >({});

  // 1. 初始化：根据传入的服务数组建立状态
  useEffect(() => {
    const initialSelection: typeof selection = {};

    serviceList.forEach(service => {
      if (!selection[service.id]) {
        initialSelection[service.id] = {
          isSelected: false,
          quantity: 1
        };
      }
    });

    if (Object.keys(initialSelection).length > 0) {
      setSelection(prev => ({
        ...prev,
        ...initialSelection
      }));
    }
  }, [serviceList]);

  // 2. 切换选中状态
  const toggleSelection = useCallback((id: string) => {
    setSelection(prev => {
      const current = prev[id];
      if (!current) return prev;

      return {
        ...prev,
        [id]: {
          ...current,
          isSelected: !current.isSelected
        }
      };
    });
  }, []);

  // 3. 更新数量
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setSelection(prev => {
      const current = prev[id];
      if (!current) return prev;

      return {
        ...prev,
        [id]: {
          ...current,
          quantity
        }
      };
    });
  }, []);

  // 4. 提供给你渲染的数据
  const services: ServiceWithSelection[] = serviceList.map(service => {
    const state = selection[service.id] || { isSelected: false, quantity: 1 };
    return {
      ...service,                // 原始服务数据
      isSelected: state.isSelected, // 覆盖/添加选择状态
      quantity: state.quantity      // 覆盖/添加数量
    };
  });

  // 5. 获取选中结果（用于提交）
  const getSelectedServices = useCallback(() => {
    return Object.entries(selection)
      .filter(([_, state]) => state.isSelected)
      .map(([id, state]) => ({
        serviceId: id,
        quantity: state.quantity,
        remark: ""
      }));
  }, [selection]);

  return {
    services,          // 渲染用的数据
    toggleSelection,   // 切换选中
    updateQuantity,    // 修改数量
    getSelectedServices // 获取选中结果
  };
}