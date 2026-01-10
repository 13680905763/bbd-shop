"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image, Checkbox } from "@heroui/react";

export interface ProductCardProps {
    id: string;
    imageUrl: string;
    title: string;
    price?: string | number;
    updateTime?: string;

    // Management mode props
    isManageMode?: boolean;
    isSelected?: boolean;
    onToggle?: (id: string) => void;

    // Navigation/Action props
    onClick?: () => void;
}

export default function ProductCard({
    id,
    imageUrl,
    title,
    price,
    updateTime,
    isManageMode = false,
    isSelected = false,
    onToggle,
    onClick,
}: ProductCardProps) {

    const handlePress = () => {
        if (isManageMode) {
            onToggle?.(id);
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
                        onValueChange={() => onToggle?.(id)}
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
                        alt={title}
                        className="w-full object-cover h-[200px]"
                        radius="lg"
                        shadow="sm"
                        referrerPolicy="no-referrer"
                        src={imageUrl}
                        width="100%"
                    />
                </CardBody>
                <CardFooter className="text-small flex-col items-start ">
                    <b className="line-clamp-2">{title}</b>
                    <p className="text-default-400 text-xs ">
                        {updateTime}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
