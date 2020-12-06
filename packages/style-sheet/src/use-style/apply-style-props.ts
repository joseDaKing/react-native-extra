import {
    BaseStyle,
    BaseStyleProps,
    CreateStyleSettings,
    TransformStyleProps
} 
from ".";

import { UseMediaQuery } from "@react-native-extra/media-query";

import { TransformsStyle } from "react-native";

import { shouldApplyOrderStyles } from "./should-apply-order-styles";



export type OrderSelector = (
    "&:last-child"
    | "&:first-child"
    | "&:nth-child(even)"
    | "&:nth-child(odd)"
    | "&:nth-last-child(even)"
    | "&:nth-last-child(odd)"
);

export function applyStyleProps(styleProps: BaseStyleProps<BaseStyle>, style: BaseStyle, mediaQuery: UseMediaQuery, settings?: CreateStyleSettings) {

    for (const key in styleProps) {

        const stylePropKey = key as keyof BaseStyleProps<BaseStyle>;

        const stylePropValue = styleProps[stylePropKey];
        
        if (shouldApplyNestedStyles(stylePropKey, mediaQuery, settings)) {

            applyStyleProps(styleProps[stylePropKey] as typeof styleProps, style, mediaQuery, settings);
        }
        else {
            
            style[stylePropKey as keyof BaseStyle] = stylePropValue as any;

            if (shouldApplyTransformStyleProps(stylePropKey, stylePropValue)) {
            
                applyTransformStyleProps(style, stylePropValue as TransformStyleProps["transform"]);
            }
        }
    }
};



function shouldApplyTransformStyleProps(stylePropKey: string, stylePropValue: any): boolean {

    return stylePropKey === "transform" && typeof stylePropValue === "object";
};

function applyTransformStyleProps(style: BaseStyle, transformStyleProp: TransformStyleProps["transform"]): void {

    const transforms: TransformsStyle["transform"] = [];

    for (const key in transformStyleProp) {

        const transformStylePropKey = key as keyof typeof transformStyleProp;

        const transformStyleProps = transformStyleProp[transformStylePropKey];

        if (transformStyleProps) {

            const transform = {
                [transformStylePropKey]: transformStyleProps 
            } as any;

            transforms.push(transform);
        }
    }

    if (transforms.length !== 0) {

        style["transform"] = transforms;
    }
};



function shouldApplyNestedStyles(stylePropKey: string, mediaQuery: UseMediaQuery, settings?: CreateStyleSettings): boolean {

    const stylePropKeyWithoutWhiteSpace = removeWhiteSpace(stylePropKey);

    return (
        shouldApplyMediaStyles(stylePropKeyWithoutWhiteSpace, mediaQuery)
        || shouldApplyOrderStyles(stylePropKey, settings)
    );
};

function shouldApplyMediaStyles(stylePropKey: string, mediaQuery: UseMediaQuery): boolean {

    const mediaLabel = "@media";
    
    return (
        !!stylePropKey.match(mediaLabel) 
        && mediaQuery(stylePropKey.replace(mediaLabel, ""))
    );
};

const removeWhiteSpaceRegex = /\s+/gi;

function removeWhiteSpace(value: string): string {

    return value.replace(removeWhiteSpaceRegex, "");
};