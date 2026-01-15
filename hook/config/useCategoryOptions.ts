import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/services";

export const useCategoryOptions = () => {
    return useQuery({
        queryKey: ["categoryOptions"],
        queryFn: getCategory,
        staleTime: 50 * 1000, // 十秒保证积分数据足够新
        refetchOnWindowFocus: true
    });
};
