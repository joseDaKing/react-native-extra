import { BaseStyle } from "./use-style";

import { StyleSheet } from "react-native";



export function composeStyleProps(style: BaseStyle[]): BaseStyle {
    
    let [styleProps, ...restStyleProps] = style;

    for (let i = 0; i < restStyleProps.length; i++) {

        const currentStyleProps = restStyleProps[i];

        styleProps = StyleSheet.compose(styleProps, currentStyleProps) as BaseStyle;
    }

    return styleProps;
};