import { 
    TextStyle, 
    ViewStyle, 
    ImageStyle,
    TextStyleAndroid,
    TextStyleIOS,
    OpaqueColorValue,
} 
from "react-native";

import { Object, Function } from "ts-toolbelt";

import { OrderSelector } from "./apply-styles/apply-order-styles";



export type BaseStyle = Object.Merge<Object.Merge<TextStyle, ViewStyle>, ImageStyle>;

type RemoveUnwantedStyleProps<Style extends BaseStyle> = (
    Object.Omit<
        Style, 
        Exclude<
            keyof TextStyleAndroid, 
            keyof ViewStyle
        > 
        | Exclude<
            keyof TextStyleIOS, 
            keyof ViewStyle
        >
        | "shadowColor"
        | "shadowOffset"
        | "shadowOpacity"
        | "shadowRadius" 
    >
);

type RemoveUnwantedValues<Style extends BaseStyle> = {
    [Key in keyof Style]: Exclude<Style[Key], OpaqueColorValue>;
};

type OrderVariantStyles<Style extends BaseStyle> = {
    [Key in OrderSelector]?: StyleProps<Style>;
};

export type StyleProps<Style extends BaseStyle> = Object.Merge<
    RemoveUnwantedValues<
        RemoveUnwantedStyleProps<
            Style
        >
    >, 
    OrderVariantStyles<
        Style
    >
>;

type InputCallback<Input, Output> = Function.Function<[Input], Output>;

type WithInputCallback<Input, Value> = (
    Exclude<Input, undefined> extends never 
    ? Value
    : Value | InputCallback<Input, Value>
);

export type ExtendedStyleProps<Style extends BaseStyle, Input> = WithInputCallback<Input, {
    [Key in keyof StyleProps<Style>]: (
        Key extends OrderSelector
        ? ExtendedStyleProps<Style, Input>
        : WithInputCallback<Input, StyleProps<Style>[Key]>
    );
}>;

export type OrderVariantSettings = { index?: number; length?: number; };

type CreateStyleArg<Input> = Exclude<Input, undefined> extends never ?  ([ OrderVariantSettings? ]): [ { input: Input; } & OrderVariantSettings];

type CreateStyle<Style extends BaseStyle, Input> = (...settings: CreateStyleArg<Input>) => Style;


export type CommonStyle = ViewStyle | ImageStyle | TextStyle;

export const useStyle = <Style extends CommonStyle, Input = undefined>(styleProps: ExtendedStyleProps<Style, Input>): CreateStyle<Style, Input> => {

    const createStyle: CreateStyle<Style, Input> = (...[settings]) => {

        return {

        } as Style;
    };

    return createStyle;
};