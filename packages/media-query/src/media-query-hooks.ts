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

import { BreakpointsContextValue } from "./media-query-components";



type MediaQuery<BreakpointValue> = (breakpointValue: BreakpointValue) => boolean;

type CreateMediaQuery<Value, BreakpointValue> = (value?: Value) => MediaQuery<BreakpointValue>; 



type CreateDimensionMediaQuery = CreateMediaQuery<number, number>;

const createMinWidthMediaQuery: CreateDimensionMediaQuery = width => breakpointWidth => {
    
    return breakpointWidth <= (width ? width : useWindowDimensions().width);
};

export const useMinWidthMediaQuery = createMinWidthMediaQuery();



const createMaxWidthMediaQuery: CreateDimensionMediaQuery = width => breakpointWidth => {

    return (width ? width : useWindowDimensions().width) <= breakpointWidth;
};

export const useMaxWidthMediaQuery = createMaxWidthMediaQuery();



const createWidthMediaQuery: CreateDimensionMediaQuery = width => {

    return breakpointWidth => {

        return (width ? width : useWindowDimensions().width) === breakpointWidth;
    };
};

export const useWidthMediaQuery: MediaQuery<number> = createWidthMediaQuery();



const createMinHeightMediaQuery: CreateDimensionMediaQuery = height => breakpointHeight => {

    return breakpointHeight <= (height ? height : useWindowDimensions().height);
};

export const useMinHeightMediaQuery = createMinHeightMediaQuery();



const createMaxHeightMediaQuery: CreateDimensionMediaQuery = height => breakpointHeight => {

    return (height ? height : useWindowDimensions().height) <= breakpointHeight;
};

export const useMaxHeightMediaQuery = createMaxHeightMediaQuery();



const createHeightMediaQuery: CreateDimensionMediaQuery = height => {

    return breakpointHeight => {

        return (height ? height : useWindowDimensions().height) === breakpointHeight;
    };
};

export const useHeightMediaQuery: MediaQuery<number> = createHeightMediaQuery();



type CreateAspectRatioMediaQuery = CreateMediaQuery<Dimensions, AspectRatio>;

const createMinAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimensions => aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (getAspectRatioValue(aspectRatio) <= useWindowAspectRatio(dimensions))
    );
};

export const useMinAspectRatioMediaQuery = createMinAspectRatioMediaQuery();



const createMaxAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimension => aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (useWindowAspectRatio(dimension) <= getAspectRatioValue(aspectRatio))
    );
};

export const useMaxAspectRatioMediaQuery = createMaxAspectRatioMediaQuery();



const createAspectRatioMediaQuery: CreateAspectRatioMediaQuery = dimension => aspectRatio => {

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

    const listener = (isReducedMotionEnabled: boolean) => setPrefersReducedMotionValue(isReducedMotionEnabled ?  "reduce" : "no-preference");

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

const useGetPrefersReducedMotionValue = (): PrefersReducedMotionValue => {
    
    if (usePlatformMediaQuery("web")) {

        return useGetPrefersReducedMotionValueWeb();
    }
    else {

        return useGetPrefersReducedMotionValueNative();
    }
};

const createPrefersReducedMotionMediaQuery: CreateMediaQuery<PrefersReducedMotionValue, PrefersReducedMotionValue> = value => mediaqueryValue => {

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

const useGetInvertedColorValue = (): InvertedColorsValue => {

    if (usePlatformMediaQuery("web")) {

        return useGetInvertedColorValueWeb();
    }
    else {

        return useGetInvertedColorValueNative();
    }
};

const createInvertedColorsMediaQuery: CreateMediaQuery<InvertedColorsValue, InvertedColorsValue> = value => mediaqueryValue => {

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



const createOrientationMediaQuery: CreateMediaQuery<Dimensions, "landscape" | "portrait"> = dimensions => orientation => {
    
    const { height, width } = dimensions ? dimensions : useWindowDimensions();

    const isPortrait = width <= height;

    return orientation === "portrait" ? isPortrait : !isPortrait;
}; 

export const useOrientationMediaQuery = createOrientationMediaQuery();


type PrefersColorSchemeValue = "dark" | "light";

const createPrefersColorSchemeMediaQuery: CreateMediaQuery<PrefersColorSchemeValue, PrefersColorSchemeValue> = value => theme => {

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

export const useMediaQueryFactory = (): UseMediaQuery => {

    const mediaQueryMetadata = useMediaQueryMetadata();

    return useMemo((): UseMediaQuery => {

        const mediaMatchers = useCreateMediaMatchers(mediaQueryMetadata);

        return (mediaQuery: string) => {

            const mediaQueryAST = parseMediaQuery(mediaQuery);

            return (
                isValidMediaQueryString(mediaQuery) 
                && getMediaQueryResult(mediaQueryAST, mediaMatchers)
            );
        };

    }, Object.values(mediaQueryMetadata));
};

export const useMediaQuery = (mediaQuery: string): boolean => {
    
    const mediaQueryMetadata = useMediaQueryMetadata();

    const dependcyArray = [
        mediaQuery,
        ...Object.values(mediaQueryMetadata)
    ];

    return useMemo((): boolean => {
        
        const mediaMatchers = useCreateMediaMatchers(mediaQueryMetadata);    

        const mediaQueryAST = parseMediaQuery(mediaQuery);

        return (
            isValidMediaQueryString(mediaQuery) 
            && getMediaQueryResult(mediaQueryAST, mediaMatchers)
        );

    }, dependcyArray);
};



const isValidDimensionMediaQueryExpressionRegexString = "(((max|min)-)?(width|height|aspect-ratio):\\s*\\d+px)";

const isValidInvertedColorMediaQueryExpressionRegexString = "(inverted-colors:\\s*(inverted|none))";

const isValidPrefersReducedMotionMediaQueryExpressionRegexString = "(prefers-reduced-motion:\\s*(reduced|no-preference))";

const isValidPlatformMediaQueryExpressionRegexString = "(platform:\\s*(ios|android|mobile|macos|windows|desktop|web))";

const isValidOrientationMediaQueryExpressionRegexString = "(orientation:\\s*(landscape|portrait))";

const isValidPrefersColorSchemeQueryExpressionRegexString = "(prefers-color-scheme:\\s*(dark|light))";

const isValidMediaQueryExpressionRegexArray = [
    isValidDimensionMediaQueryExpressionRegexString,
    isValidInvertedColorMediaQueryExpressionRegexString,
    isValidPrefersReducedMotionMediaQueryExpressionRegexString,
    isValidPlatformMediaQueryExpressionRegexString,
    isValidOrientationMediaQueryExpressionRegexString,
    isValidPrefersColorSchemeQueryExpressionRegexString,
];

const isValidMediaQueryExpressionRegexString = `(${isValidMediaQueryExpressionRegexArray.join("|")})`.trim();

const isValidMediaQueryStringRegex = new RegExp(`^\\s*(@media\\s*\\(\\s*${isValidMediaQueryExpressionRegexString}\\s*\\))\\s*(\\s*(and|,)\\s*\\(\\s*${isValidMediaQueryExpressionRegexString}\\s*\\))*$`);

export function isValidMediaQueryString(mediaQuery: string): boolean {

    return isValidMediaQueryStringRegex.test(mediaQuery);
};



type MediaQueryMetadata = Dimensions & {
    invertedColor: InvertedColorsValue;
    prefersReducedMotion: PrefersReducedMotionValue;
    prefersColorScheme: PrefersColorSchemeValue;
}

function useMediaQueryMetadata(): MediaQueryMetadata {

    const { width, height } = useWindowDimensions();

    const invertedColorValue = useGetInvertedColorValue();

    const prefersReducedMotionValue = useGetPrefersReducedMotionValue();

    const colorSchemeValue = useColorScheme();

    const theme = colorSchemeValue ? colorSchemeValue : "light";

    return {
        width,
        height,
        invertedColor: invertedColorValue,
        prefersReducedMotion: prefersReducedMotionValue,
        prefersColorScheme: theme
    };
};

function useCreateMediaMatchers(mediaQueryMetadata: MediaQueryMetadata): MediaMatchers {

    const mediaMatchers: MediaMatchers = {
        width: createWidthMediaQuery(mediaQueryMetadata.width),
        "min-width": createMinWidthMediaQuery(mediaQueryMetadata.width),
        "max-width": createMaxWidthMediaQuery(mediaQueryMetadata.width),
        height: createHeightMediaQuery(mediaQueryMetadata.height),
        "min-height": createMinHeightMediaQuery(mediaQueryMetadata.height),
        "max-height": createMaxHeightMediaQuery(mediaQueryMetadata.height),
        "aspect-ratio": createAspectRatioMediaQuery(mediaQueryMetadata),
        "min-aspect-ratio": createMinAspectRatioMediaQuery(mediaQueryMetadata),
        "max-aspect-ratio": createMaxAspectRatioMediaQuery(mediaQueryMetadata),
        "inverted-colors": createInvertedColorsMediaQuery(mediaQueryMetadata.invertedColor),
        "prefers-reduced-motion": createPrefersReducedMotionMediaQuery(mediaQueryMetadata.prefersReducedMotion),
        platform: usePlatformMediaQuery,
        orientation: createOrientationMediaQuery(mediaQueryMetadata),
        "prefers-color-scheme": createPrefersColorSchemeMediaQuery(mediaQueryMetadata.prefersColorScheme)
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

    const mediaQuery = useMediaQueryFactory();

    return (breakpoint: keyof ContextValue["breakpoints"]): boolean => {

        const mediaQueryString = breakpoints[breakpoint as string];

        return mediaQuery(mediaQueryString);
    };
};