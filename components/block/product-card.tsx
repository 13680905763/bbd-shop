"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image, Checkbox } from "@heroui/react";

export interface ProductInfo {
    id: string;
    imageUrl: string;
    title: string;
    price?: string | number;
    updateTime?: string;
    [key: string]: any; // 允许传入其他字段
}

export interface ProductCardProps {
    product: ProductInfo;
    // Management mode props
    isManageMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    // Navigation/Action props
    onClick?: () => void;
}

export default function ProductCard({
    product,
    isManageMode = false,
    isSelected = false,
    onSelect,
    onClick,
}: ProductCardProps) {
    const { id, productPicUrl, productTitle, updateTime } = product;

    const handlePress = () => {
        if (isManageMode) {
            onSelect?.(id);
        } else {
            onClick?.();
        }
    };
    return (
        <div className="relative group h-full">
            {isManageMode && (
                <div className="absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1 shadow-sm backdrop-blur-sm">
                    <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => onSelect?.(id)}
                        classNames={{
                            wrapper: "m-0",
                        }}
                    />
                </div>
            )}
            <Card
                isPressable
                shadow="sm"
                className={`h-full transition-all ${isManageMode && isSelected
                    ? "border-2 border-primary"
                    : "border-2 border-transparent"
                    }`}
                onPress={handlePress}
            >
                <CardBody className="overflow-visible p-0 relative">
                    <Image
                        alt={productTitle}
                        className="w-full object-cover h-[200px]"
                        radius="lg"
                        shadow="sm"
                        referrerPolicy="no-referrer"
                        src={productPicUrl}
                        width="100%"
                    />
                </CardBody>
                <CardFooter className="text-small flex-col items-start ">
                    <b className="line-clamp-2">{productTitle}</b>
                    <p className="text-default-400 text-xs ">
                        {updateTime}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
