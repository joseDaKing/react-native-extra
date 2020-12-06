import { 
    ViewStyle,
    TextStyle,
    ImageStyle,
    TextStyleAndroid,
    TextStyleIOS,
    ShadowStyleIOS,
}
from "react-native";

import { Object } from "ts-toolbelt";

import { applyCalcValues } from "./apply-calc-values";

import { applyStyleProps } from "./apply-style-props";

import { useMediaQueryFactory } from "@react-native-extra/media-query";

import { 
    useCalcFactory, 
    useRotationCalcFactory 
} 
from "@react-native-extra/calculate";

import { OrderSelector } from "./apply-style-props";

import { useEffect, useMemo, useState } from "react";

import {
    useColorScheme,
    useWindowDimensions,
    AccessibilityInfo
} 
from "react-native";



export type BaseStyle = (
    Object.Merge<
        Object.Merge<
            ViewStyle, 
            ImageStyle
        >, 
        TextStyle
    >
);

export type TransformStyleProps = {
    transform?: {
        perspective?: number | string;
        rotate?: string;
        rotateX?: string;
        rotateY?: string;
        rotateZ?: string;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        translateX?: number | string;
        translateY?: number | string;
        skewX?: string;
        skewY?: string;
        matrix?: number[];
    }
};

type PropsToRemove = (
    | "overlayColor"
    | "direction"
    | "elevation"
    | "tint"
    | "transform"
    | "transformMatrix"
    | "translateX"
    | "translateY"
);

export type BaseStyleProps<Style extends BaseStyle> = (
    Object.Merge<
        Omit<
            Style, 
            keyof ShadowStyleIOS
            | keyof Omit<TextStyleIOS, keyof ViewStyle>
            | keyof Omit<TextStyleAndroid, keyof ViewStyle>
            | PropsToRemove
        >,
        OrderBaseStyleProps<Style>
    > & TransformStyleProps
);

type OrderBaseStyleProps<Style extends BaseStyle> = {
    [Key in OrderSelector]?: BaseStyleProps<Style>;
};

export type StyleType = "view" | "text" | "image";

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

    const mediaQuery = useMediaQueryFactory();

    const calc = useCalcFactory();

    const rotationCalc = useRotationCalcFactory();

    const createStyle: CreateStyle<Type> = settings => {

        const style = {} as Style<Type>;

        applyStyleProps(styleProps, style, mediaQuery, settings);

        applyCalcValues(style, calc, rotationCalc);

        return style;
    };

    return createStyle;
};



export function useStyle<Type extends StyleType>(styleProps: StyleProps<Type>, settings?: CreateStyleSettings): Style<Type> {

    const mediaQuery = useMediaQueryFactory();

    const calc = useCalcFactory();

    const rotationCalc = useRotationCalcFactory();

    const dependency = `${JSON.stringify(styleProps)}${useHasMediaQueryMetadataChanged()}`;

    const style: Style<Type> = useMemo((): Style<Type> => {
    
        const style = {} as Style<Type>;

        applyStyleProps(styleProps, style, mediaQuery, settings);

        applyCalcValues(style, calc, rotationCalc);

        return style;

    }, [ dependency ]);

    return style;
};



function useHasMediaQueryMetadataChanged(): string {

    const dimensions = useWindowDimensions();

    const colorScheme = useColorScheme();

    const hasAccessibilityInfoChanged = useHasAccessibilityInfoChanged();

    return `${colorScheme}${hasAccessibilityInfoChanged}${JSON.stringify(dimensions)}`;
};

function useHasAccessibilityInfoChanged(): string {

    const [hasInvertedColorsChanged, setHasInvertColorsChanged] = useState(true);

    AccessibilityInfo.addEventListener("invertColorsChanged", setHasInvertColorsChanged);


    const [hasReducedMotionChanged, setHasReducedMotionChanged] = useState(true);

    AccessibilityInfo.addEventListener("reduceMotionChanged", setHasReducedMotionChanged);


    const [hasReducedTransparencyChanged, setHasReducedTransparencyChanged] = useState(true);

    AccessibilityInfo.addEventListener("reduceTransparencyChanged", setHasReducedTransparencyChanged);


    useEffect(() => () => {

        AccessibilityInfo.removeEventListener("invertColorsChanged", setHasInvertColorsChanged);

        AccessibilityInfo.removeEventListener("reduceMotionChanged", setHasReducedMotionChanged);

        AccessibilityInfo.removeEventListener("reduceTransparencyChanged", setHasReducedTransparencyChanged);

    }, []);

    return `${hasInvertedColorsChanged}${hasReducedMotionChanged}${hasReducedTransparencyChanged}`;
};