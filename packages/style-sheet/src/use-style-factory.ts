import { useCallback } from "react";

import { 
    ViewStyle,
    TextStyle,
    ImageStyle,
    TextStyleAndroid,
    TextStyleIOS,
    ShadowStyleIOS,
    useWindowDimensions,
    useColorScheme,
    Platform
}
from "react-native";

import { Object } from "ts-toolbelt";

import { applyCalcValues } from "./apply-calc-values";

import { applyStyleProps } from "./apply-style-props";

import { 
    useMediaQueryFactory,
    usePrefersReducedMotionMediaQuery
}
from "@react-native-extra/media-query";

import { useCalcFactory } from "@react-native-extra/calculate";

import { OrderSelector } from "./apply-style-props";



export type BaseStyle = Object.Merge<Object.Merge<ViewStyle, ImageStyle>, TextStyle>;

export type BaseStyleProps<Style extends BaseStyle> = Omit<
    Style, 
    keyof ShadowStyleIOS
    | keyof Omit<TextStyleIOS, keyof ViewStyle>
    | keyof Omit<TextStyleAndroid, keyof ViewStyle>
    | "overlayColor"
    | "direction"
    | "elevation"
    | "tint"
> & OrderBaseStyleProps<Style>;

type OrderBaseStyleProps<Style extends BaseStyle> = {
    [Key in OrderSelector]?: BaseStyleProps<Style>;
};

type StyleType = "view" | "text" | "image";

type Style<Type extends StyleType> = (
    Type extends "view" ? ViewStyle :
    Type extends "text" ? TextStyle :
    Type extends "image" ? ImageStyle
    : never
);

export type StyleProps<Type extends StyleType> = BaseStyleProps<Style<Type>>;

export type CreateStyleSettings = {
    index?: number;
    length?: number;
};

type CreateStyle<Type extends StyleType> = (settings?: CreateStyleSettings) => Style<Type>;

export function useStyleFactory<Type extends StyleType>(styleProps: StyleProps<Type>): CreateStyle<Type> {

    const { height, width } = useWindowDimensions();

    const colorScheme = useColorScheme();

    const prefersReducedMotion = usePrefersReducedMotionMediaQuery("reduce");

    const dependencyArray = [ 
        height, 
        width, 
        colorScheme,
        prefersReducedMotion
    ] as const;


    const mediaQuery = useMediaQueryFactory();

    const calc = useCalcFactory();

    const createStyle: CreateStyle<Type> = useCallback(settings => {

        const style = {} as Style<Type>;

        applyStyleProps(styleProps, style, mediaQuery, settings);

        applyCalcValues(style, calc);

        return style;

    }, dependencyArray);

    return createStyle;
};