import { 
    ViewStyle,
    TextStyle,
    ImageStyle,
    TextStyleAndroid,
    TextStyleIOS,
    ShadowStyleIOS
}
from "react-native";

import { Object } from "ts-toolbelt";

import { applyCalcValues } from "./apply-styles/apply-calc-values";

import { applyElevationStyles } from "./apply-styles/apply-elevation-styles";

import { applyMediaQueryStyles } from "./apply-styles/apply-media-query-styles";

import { applyOrderStyles } from "./apply-styles/apply-order-styles";



export type BaseStyle = Object.Merge<Object.Merge<ViewStyle, ImageStyle>, TextStyle>;

export type BaseStyleProps<Style extends BaseStyle> = Omit<
    Style, 
    keyof ShadowStyleIOS
    | keyof Omit<TextStyleIOS, keyof ViewStyle>
    | keyof Omit<TextStyleAndroid, keyof ViewStyle>
    | "overlayColor"
    | "direction"
> & OrderBaseStyleProps<Style>;

type OrderSelector = (
    "&:last-child" 
    | "&:first-child" 
    | "&:nth-child(even)"
    | "&:nth-child(odd)"
    | "&:nth-last-child(even)"
    | "&:nth-last-child(odd)"
);

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

type StyleProps<Type extends StyleType> = BaseStyleProps<Style<Type>>;

export type CreateStyleSettings = {
    index: number;
    length: number;
};

type CreateStyle<Type extends StyleType> = (settings?: CreateStyleSettings) => Style<Type>;

export function useStyleFactory<Type extends StyleType>(styleProps: StyleProps<Type>): CreateStyle<Type> {

    const createStyle: CreateStyle<Type> = settings => {

        const style = {} as Style<Type>;

        applyMediaQueryStyles(styleProps, style);

        applyOrderStyles(styleProps, style, settings);

        applyElevationStyles(style);

        applyCalcValues(style,);

        return style;
    };

    return createStyle;
};