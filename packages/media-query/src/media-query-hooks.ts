import { Context, useContext, useEffect, useMemo, useState } from "react";

import { AccessibilityInfo, useWindowDimensions, Platform, useColorScheme } from "react-native";

import { Dimensions } from "./types";

import { AspectRatio } from "./types";

import { 
    parse as parseMediaQuery,
    AST as MediaQuerAST,
    Expression,
    QueryNode
}
from "css-mediaquery";

import { isValidMediaQueryAst } from "./is-valid-media-query-ast";

import { BreakpointsContextValue } from "./media-query-components";



export type MediaQuery<BreakpointValue> = (breakpointValue: BreakpointValue) => boolean;

export type CreateMediaQuery<Value, BreakpointValue> = (value?: Value) => MediaQuery<BreakpointValue>; 



type CreateDimensionMediaQuery = CreateMediaQuery<number, number>;

export const createMinWidthMediaQuery: CreateDimensionMediaQuery = width => breakpointWidth => {
    
    return breakpointWidth <= (width ? width : useWindowDimensions().width);
};

export const useMinWidthMediaQuery = createMinWidthMediaQuery();



export const createMaxWidthMediaQuery: CreateDimensionMediaQuery = width => breakpointWidth => {

    return (width ? width : useWindowDimensions().width) <= breakpointWidth;
};

export const useMaxWidthMediaQuery = createMaxWidthMediaQuery();



export const createWidthMediaQuery: CreateDimensionMediaQuery = width => {

    return breakpointWidth => {

        return (width ? width : useWindowDimensions().width) === breakpointWidth;
    };
};

export const useWidthMediaQuery: MediaQuery<number> = createWidthMediaQuery();



export const createMinHeightMediaQuery: CreateDimensionMediaQuery = height => breakpointHeight => {

    return breakpointHeight <= (height ? height : useWindowDimensions().height);
};

export const useMinHeightMediaQuery = createMinHeightMediaQuery();



export const createMaxHeightMediaQuery: CreateDimensionMediaQuery = height => breakpointHeight => {

    return (height ? height : useWindowDimensions().height) <= breakpointHeight;
};

export const useMaxHeightMediaQuery = createMaxHeightMediaQuery();



export const createHeightMediaQuery: CreateDimensionMediaQuery = height => {

    return breakpointHeight => {

        return (height ? height : useWindowDimensions().height) === breakpointHeight;
    };
};

export const useHeightMediaQuery: MediaQuery<number> = createHeightMediaQuery();



type CreateAspectRatioMediaQuery = CreateMediaQuery<Dimensions, AspectRatio>;

export const createMinAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimensions => aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (getAspectRatioValue(aspectRatio) <= useWindowAspectRatio(dimensions))
    );
};

export const useMinAspectRatioMediaQuery = createMinAspectRatioMediaQuery();



export const createMaxAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimension => aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (useWindowAspectRatio(dimension) <= getAspectRatioValue(aspectRatio))
    );
};

export const useMaxAspectRatioMediaQuery = createMaxAspectRatioMediaQuery();



export const createAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimension => aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio) 
        && (useWindowAspectRatio(dimension) === getAspectRatioValue(aspectRatio))
    );
};

export const useAspectRatioMediaQuery = createAspectRatioMediaQuery();



function useWindowAspectRatio(dimensions?: Dimensions): number {

    const { width, height } = dimensions ? dimensions : useWindowDimensions();

    return round(width / height, 6);
};

function getAspectRatioValue(aspectRatio: AspectRatio) {

    const [ widthRatio, heightRatio ] = aspectRatio;

    const aspectRatioValue = widthRatio / heightRatio;

    return round(aspectRatioValue, 6);
};

function round(value: number, roundLevel: number): number {

    let factor = "1";

    for (let i = 1; i < roundLevel; i++) {

        factor += "0"
    }

    return Math.round(value * Number(factor)) / Number(factor);
};

function validateAspectRatioValue(aspectRatio: AspectRatio): boolean {

    const [widthRatio, heightRatio] = aspectRatio;

    return (
        isInteger(widthRatio)
        && isInteger(heightRatio)
        && 0 < heightRatio
        && 0 < widthRatio
    );
};

function isInteger(value: number): boolean {

    return Math.round(value) === value;
};



export const usePlatformMediaQuery: MediaQuery<typeof Platform.OS | "mobile" | "desktop"> = platform => {
    
    if (platform === "mobile") {

        return (
            ("ios" === Platform.OS)
            || ("android" === Platform.OS)
        );
    }

    if (platform === "desktop") {
        
        return (
            ("macos" === Platform.OS)
            || ("windows" === Platform.OS)
        );
    }

    return platform === Platform.OS;
};



type PrefersReducedMotionValue = "reduce" | "no-preference";

const useGetPrefersReducedMotionValueNative = (): PrefersReducedMotionValue => {
    
    const inititialValue = AccessibilityInfo.isInvertColorsEnabled() ? "reduce" : "no-preference";

    const [prefersReducedMotionValue, setPrefersReducedMotionValue] = useState<PrefersReducedMotionValue>(inititialValue);

    const listener = (isReducedMotionEnabled: boolean) => setPrefersReducedMotionValue(AccessibilityInfo ?  "reduce" : "no-preference");

    useAssignChangeListener(AccessibilityInfo, listener);

    return prefersReducedMotionValue;
};

const useGetPrefersReducedMotionValueWeb = (): PrefersReducedMotionValue => {
    
    const match = matchMedia("(prefers-reduced-motion: reduce)");

    const inititialValue = match.matches ? "reduce" : "no-preference";

    const [prefersReducedMotionValue, setPrefersReducedMotionValue] = useState<PrefersReducedMotionValue>(inititialValue);

    const listener = ({ matches }: { matches: boolean }) => setPrefersReducedMotionValue(matches ?  "reduce" : "no-preference");

    useAssignChangeListener(match, listener);

    return prefersReducedMotionValue;
};

export const useGetPrefersReducedMotionValue = (): PrefersReducedMotionValue => {
    
    if (usePlatformMediaQuery("web")) {

        return useGetPrefersReducedMotionValueWeb();
    }
    else {

        return useGetPrefersReducedMotionValueNative();
    }
};

export const createPrefersReducedMotionMediaQuery: CreateMediaQuery<PrefersReducedMotionValue, PrefersReducedMotionValue> = value => mediaqueryValue => {

    return mediaqueryValue === (value ? value : useGetPrefersReducedMotionValue());
};

export const usePrefersReducedMotionMediaQuery = createPrefersReducedMotionMediaQuery();



type InvertedColorsValue = "inverted" | "none";

const useGetInvertedColorValueNative = (): InvertedColorsValue => {

    const inititialValue = AccessibilityInfo.isInvertColorsEnabled() ? "inverted" : "none";

    const [invertedColorValue, setInvertedColorValue] = useState<InvertedColorsValue>(inititialValue);

    const listener = (isInvertedColorEnabled: boolean) => setInvertedColorValue(isInvertedColorEnabled ? "inverted" : "none");

    useAssignChangeListener(AccessibilityInfo, listener);

    return invertedColorValue;
};

const useGetInvertedColorValueWeb = (): InvertedColorsValue => {

    const match = matchMedia("(inverted-colors: inverted)");

    const inititialValue = match.matches ? "inverted" : "none";

    const [invertedColorValue, setInvertedColorValue] = useState<InvertedColorsValue>(inititialValue);

    const listener = ({ matches }: { matches: boolean }) => setInvertedColorValue(matches ? "inverted" : "none");

    useAssignChangeListener(match, listener);

    return invertedColorValue;
};

export const useGetInvertedColorValue = (): InvertedColorsValue => {

    if (usePlatformMediaQuery("web")) {

        return useGetInvertedColorValueWeb();
    }
    else {

        return useGetInvertedColorValueNative();
    }
};

export const createInvertedColorsMediaQuery: CreateMediaQuery<InvertedColorsValue, InvertedColorsValue> = value => mediaqueryValue => {

    return mediaqueryValue === (value ? value : useGetInvertedColorValue());
};

export const useInvertedColorsMediaQuery = createInvertedColorsMediaQuery();



type ListenerCallback<Input extends any[]> = (...args: Input) => any | void;

type Listener<Type extends string, Input extends any[]> = (type: Type, listenerCallback: ListenerCallback<Input>) => void;

type ListenerObject<Input extends any[]> = {
    addEventListener: Listener<"change", Input>;
    removeEventListener: Listener<"change", Input>;
}

function useAssignChangeListener<Input extends any[] = []>(listenerObject: ListenerObject<Input>, listener: ListenerCallback<Input>) {
    
    useEffect(() => {

        listenerObject.addEventListener("change", listener);

        return () => {

            listenerObject.removeEventListener("change", listener);
        };
    }, []);
};



export const createOrientationMediaQuery: CreateMediaQuery<Dimensions, "landscape" | "portrait"> = dimensions => orientation => {
    
    const { height, width } = dimensions ? dimensions : useWindowDimensions();

    const isPortrait = width <= height;

    return orientation === "portrait" ? isPortrait : !isPortrait;
}; 

export const useOrientationMediaQuery = createOrientationMediaQuery();


type PrefersColorSchemeValue = "dark" | "light";

export const createPrefersColorSchemeMediaQuery: CreateMediaQuery<PrefersColorSchemeValue, PrefersColorSchemeValue> = value => theme => {

    return (value ? value : useColorScheme()) === theme;
};

export const usePrefersColorSchemeMediaQuery = createPrefersColorSchemeMediaQuery();



type MediaMatchers = {
    width: typeof useWidthMediaQuery;
    "min-width": typeof useMinWidthMediaQuery;
    "max-width": typeof useMaxWidthMediaQuery;
    height: typeof useHeightMediaQuery;
    "min-height": typeof useMinHeightMediaQuery;
    "max-height": typeof useMaxHeightMediaQuery;
    "aspect-ratio": typeof useAspectRatioMediaQuery;
    "min-aspect-ratio": typeof useMinAspectRatioMediaQuery;
    "max-aspect-ratio": typeof useMaxAspectRatioMediaQuery;
    "inverted-colors": typeof useInvertedColorsMediaQuery;
    "prefers-reduced-motion": typeof usePrefersReducedMotionMediaQuery;
    platform: typeof usePlatformMediaQuery;
    orientation: typeof useOrientationMediaQuery;
    "prefers-color-scheme": typeof usePrefersColorSchemeMediaQuery;
};

type MediaMatchersKeys = keyof MediaMatchers;

export type UseMediaQuery = (mediaQuery: string) => boolean;

export const useInitMediaQuery = (): UseMediaQuery => {

    const mediaMatchers = useCreateMediaMatchers();

    return (mediaQuery: string) => {

        const mediaQueryAST = parseMediaQuery(mediaQuery);

        return isValidMediaQueryAst(mediaQueryAST) && getMediaQueryResult(mediaQueryAST, mediaMatchers);
    };
};

export const useMediaQuery = (mediaQuery: string): boolean => {
    
    const useMediaQueryHook = useInitMediaQuery();

    return useMediaQueryHook(mediaQuery); 
};

function useCreateMediaMatchers(): MediaMatchers {

    const dimensions = useWindowDimensions();

    const invertedColorValue = useGetInvertedColorValue();

    const prefersReducedMotionValue = useGetPrefersReducedMotionValue();

    const colorSchemeValue = useColorScheme();

    const theme = colorSchemeValue ? colorSchemeValue : "light";

    const mediaMatchers: MediaMatchers = {
        width: createWidthMediaQuery(dimensions.width),
        "min-width": createMinWidthMediaQuery(dimensions.width),
        "max-width": createMaxWidthMediaQuery(dimensions.width),
        height: createHeightMediaQuery(dimensions.height),
        "min-height": createMinHeightMediaQuery(dimensions.height),
        "max-height": createMaxHeightMediaQuery(dimensions.height),
        "aspect-ratio": createAspectRatioMediaQuery(dimensions),
        "min-aspect-ratio": createMinAspectRatioMediaQuery(dimensions),
        "max-aspect-ratio": createMaxAspectRatioMediaQuery(dimensions),
        "inverted-colors": createInvertedColorsMediaQuery(invertedColorValue),
        "prefers-reduced-motion": createPrefersReducedMotionMediaQuery(prefersReducedMotionValue),
        platform: usePlatformMediaQuery,
        orientation: createOrientationMediaQuery(dimensions),
        "prefers-color-scheme": createPrefersColorSchemeMediaQuery(theme),
    };

    return mediaMatchers;
};

function getMediaQueryResult(mediaQueryAST: MediaQuerAST, mediaMatchers: MediaMatchers): boolean {
  
    let isAllMediaQueriesMathcings = false;

    for (const queryNode of mediaQueryAST) {

        const isMediaQueryMatching = getMediaQueryExpressionResult(queryNode, mediaMatchers);

        isAllMediaQueriesMathcings = isAllMediaQueriesMathcings || isMediaQueryMatching;

        if (isAllMediaQueriesMathcings) break;
    }

    return isAllMediaQueriesMathcings;
};

function getMediaQueryExpressionResult(queryNode: QueryNode, mediaMatchers: MediaMatchers): boolean {
    
    let isMediaQueryMatching = true;

    for (const expression of queryNode.expressions) {

        const { feature, value } = expression;

        if (feature === "height" || feature === "width") {

            isMediaQueryMatching = isMediaQueryMatching && getMediaQueryDimensionResult(expression, mediaMatchers);
        } 

        if (feature === "orientation") {

            isMediaQueryMatching = isMediaQueryMatching && mediaMatchers.orientation(value as any);
        }

        if (feature === "platform") {

            isMediaQueryMatching = isMediaQueryMatching && mediaMatchers.platform(value as any);
        }

        if (feature === "prefers-color-scheme") {

            isMediaQueryMatching = isMediaQueryMatching && mediaMatchers["prefers-color-scheme"](value as any);
        }

        if (feature === "prefers-reduced-motion") {

            isMediaQueryMatching = isMediaQueryMatching && mediaMatchers["prefers-reduced-motion"](value as any);
        }

        if (feature === "inverted-colors") {

            isMediaQueryMatching = isMediaQueryMatching && mediaMatchers["inverted-colors"](value as any);
        }

        if (feature === "aspect-ratio") {
            
            isMediaQueryMatching = isMediaQueryMatching && getMediaQueryAspectRatioResult(expression, mediaMatchers);
        }

        if (!isMediaQueryMatching) break;
    }

    return isMediaQueryMatching;
};

function getMediaQueryDimensionResult(expression: Expression, mediaMatchers: MediaMatchers): boolean {

    const { feature, modifier, value } = expression;

    const expressionValueInPixel = getValueFromPixels(value);

    let mediaMatcherType = "";

    if (modifier === "min") {
        
        mediaMatcherType = `min-${feature}`;
    }
    else if (modifier === "max") {

        mediaMatcherType = `max-${feature}`;
    }
    else {

        mediaMatcherType = feature;
    }

    const mediaMatcher = mediaMatchers[mediaMatcherType as MediaMatchersKeys] as MediaQuery<number>;

    const isMathcing = mediaMatcher(expressionValueInPixel);

    return isMathcing;
};

function getValueFromPixels(dimensionValue: string): number {

    const [ valueInStr ] = dimensionValue.split(/(?=px)/);

    return Number(valueInStr);
};

function getMediaQueryAspectRatioResult(expression: Expression, mediaMatchers: MediaMatchers): boolean {

    const { feature, modifier, value } = expression;

    let mediaMatcherType = "";

    if (modifier === "min") {
        
        mediaMatcherType = `min-${feature}`;
    }
    else if (modifier === "max") {

        mediaMatcherType = `max-${feature}`;
    }
    else {

        mediaMatcherType = feature;
    }

    const mediaMatcher = mediaMatchers[mediaMatcherType as MediaMatchersKeys] as MediaQuery<AspectRatio>;

    const [widthRatioStr, heightRatioStr] = value.split("/");

    const widthRatioNumber = Number(widthRatioStr);

    const heightRatioNumber = Number(heightRatioStr);

    const isMathcing = mediaMatcher([ widthRatioNumber, heightRatioNumber ]);

    return isMathcing;
};



export const useMediaQueryFromContext = <ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>) => {

    const { breakpoints } = useContext(context);

    const mediaQuery = useInitMediaQuery();

    return (breakpoint: keyof Context<ContextValue>): boolean => {

        const mediaQueryString = breakpoints[breakpoint];

        return mediaQuery(mediaQueryString);
    };
};