import { Context, useContext, useEffect, useState } from "react";

import { AccessibilityInfo, useWindowDimensions, Platform, useColorScheme } from "react-native";

import { BreakpointsContextValue } from "./media-query-components";

import { AspectRatio } from "./types";

import { 
    parse as parseMediaQuery,
    AST as MediaQuerAST,
    Expression,
    QueryNode
}
from "css-mediaquery";

import { isValidMediaQueryAst } from "./is-valid-media-query-ast";



export type DimensionMediaQueryHook = (dimension: number) => boolean;

export const useMinWidth: DimensionMediaQueryHook = width => {
    
    return useWindowDimensions().width <= width;
};

export const useMaxWidth: DimensionMediaQueryHook = width => {

    return width <= useWindowDimensions().width;
};

export const useWidth: DimensionMediaQueryHook = width => {

    return useWindowDimensions().width === width;
};



export const useMinheight: DimensionMediaQueryHook = height => {
    
    return useWindowDimensions().height <= height;
};

export const useMaxHeight: DimensionMediaQueryHook = height => {

    return height <= useWindowDimensions().height;
};

export const useHeight: DimensionMediaQueryHook = height => {

    return useWindowDimensions().height === height;
};



export type AspectMediaQueryHook = (aspectRatio: AspectRatio) => boolean;

export const useMinAspectRatio: AspectMediaQueryHook = aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (getAspectRatioValue(aspectRatio) <= useWindowAspectRatio())
    );
};

export const useMaxAspectRatio: AspectMediaQueryHook = aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (useWindowAspectRatio() <= getAspectRatioValue(aspectRatio))
    );
};

export const useAspectRatio: AspectMediaQueryHook = aspectRatio => {

    return (
        validateAspectRatioValue(aspectRatio)
        && (useWindowAspectRatio() === getAspectRatioValue(aspectRatio))
    );
};

function useWindowAspectRatio(): number {

    const { width, height } = useWindowDimensions();

    return width / height;
};

function getAspectRatioValue(aspectRatio: AspectRatio) {

    const [ widthRatio, heightRatio ] = aspectRatio;

    const aspectRatioValue = widthRatio / heightRatio;

    return aspectRatioValue;
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



export function usePrefersReducedMotion(value: "reduce" | "no-preference"): boolean {

    const isWeb = usePlatform("web");

    if (isWeb) {

        return usePrefersReducedMotionWeb(value);
    }
    else {

        return usePrefersReducedMotionNative(value);
    }
};

function usePrefersReducedMotionNative(value: "reduce" | "no-preference"): boolean {
    
    const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

    const listener = (prefersReducedMotion: boolean) => {
        
        prefersReducedMotion = value === "reduce" ? prefersReducedMotion : !prefersReducedMotion;

        setIsReducedMotionEnabled(prefersReducedMotion);
    };

    useEffect(() => {

        AccessibilityInfo.addEventListener("reduceMotionChanged", listener);
        
        return () => {

            AccessibilityInfo.removeEventListener("reduceMotionChanged", listener);
        };
    }, []);

    return isReducedMotionEnabled;
};

function usePrefersReducedMotionWeb(value: "reduce" | "no-preference"): boolean {

    const mediaQueryList = matchMedia(`(prefers-reduced-motion: ${value})`);

    const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(mediaQueryList.matches);

    type Listener = (arg: { matches: boolean; }) => any;

    const listener: Listener = ({ matches }) => {
        
        setIsReducedMotionEnabled(matches);
    };

    useEffect(() => {

        mediaQueryList.addEventListener("change", listener);

        return () => {

            mediaQueryList.removeEventListener("change", listener);
        }
    });

    return isReducedMotionEnabled;
};



export function useInvertedColors(value: "inverted" | "none"): boolean {
    
    const isWeb = usePlatform("web");

    if (isWeb) {

        return useInvertedColorsWeb(value);
    }
    else {
        
        return useInvertedColorsNative(value);
    }
};

function useInvertedColorsNative(value: "inverted" | "none"): boolean {

    const [isInvertedColorEnabled, setIsInvertedColorEnabled] = useState(false);

    useEffect(() => {

        AccessibilityInfo.addEventListener("invertColorsChanged", setIsInvertedColorEnabled);

        return () => {

            AccessibilityInfo.removeEventListener("invertColorsChanged", setIsInvertedColorEnabled);
        };
    }, []);

    return value === "inverted" ? isInvertedColorEnabled : !isInvertedColorEnabled;
};

function useInvertedColorsWeb(value: "inverted" | "none"): boolean {

    const mediaQueryList = matchMedia(`(inverted-colors: ${value})`);

    const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(mediaQueryList.matches);

    type Listener = (arg: { matches: boolean; }) => any;

    const listener: Listener = ({ matches }) => {
        
        setIsReducedMotionEnabled(matches);
    };

    useEffect(() => {

        mediaQueryList.addEventListener("change", listener);

        return () => {

            mediaQueryList.removeEventListener("change", listener);
        }
    });

    return isReducedMotionEnabled;
};



export function usePlatform(platform: typeof Platform.OS | "mobile" | "desktop"): boolean {
    
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

export function useOrientation(orientation: "landscape" | "portrait"): boolean {

    const { height, width } = useWindowDimensions();

    const isPortrait = width <= height;

    return orientation === "portrait" ? isPortrait : !isPortrait;
};

export function usePrefersColorScheme(theme: "dark" | "light"): boolean {

    return useColorScheme() === theme;
};



export type IsMediaQueryFromContext<ContextValue extends BreakpointsContextValue> = (type: keyof ContextValue["breakpoints"]) => boolean;

export function useMediaQueryFromContext<ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>): IsMediaQueryFromContext<ContextValue> {
    
    const { breakpoints } = useContext(context);

    const isMediaQueryFromContext: IsMediaQueryFromContext<ContextValue> = type => {

        const mediaQueryString = breakpoints[type as string];

        return useMediaQuery(mediaQueryString);
    };

    return isMediaQueryFromContext;
};



type MediaMatchers = {
    width: typeof useWidth;
    "min-width": typeof useMinWidth;
    "max-width": typeof useMaxWidth;
    height: typeof useHeight;
    "min-height": typeof useMinheight;
    "max-height": typeof useMaxHeight;
    "aspect-ratio": typeof useAspectRatio;
    "min-aspect-ratio": typeof useMinAspectRatio;
    "max-aspect-ratio": typeof useMaxAspectRatio;
    "inverted-colors": typeof useInvertedColors;
    "prefers-reduced-motion": typeof usePrefersReducedMotion;
    platform: typeof usePlatform;
    orientation: typeof useOrientation;
    "prefers-color-scheme": typeof usePrefersColorScheme;
};

type MediaMatchersKeys = keyof MediaMatchers;

export type UseMediaQuery = (mediaQuery: string) => boolean;

export function useInitMediaQuery(): UseMediaQuery {

    const mediaMatchers: MediaMatchers = {
        width: useWidth,
        "min-width": useMinWidth,
        "max-width": useMaxWidth,
        height: useHeight,
        "min-height": useMinheight,
        "max-height":useMaxHeight,
        "aspect-ratio": useAspectRatio,
        "min-aspect-ratio": useMinAspectRatio,
        "max-aspect-ratio": useMaxAspectRatio,
        "inverted-colors": useInvertedColors,
        "prefers-reduced-motion": usePrefersReducedMotion,
        platform: usePlatform,
        orientation: useOrientation,
        "prefers-color-scheme": usePrefersColorScheme
    };

    return (mediaQuery: string) => {

        const mediaQueryAST = parseMediaQuery(mediaQuery);

        return isValidMediaQueryAst(mediaQueryAST) && getMediaQueryResult(mediaQueryAST, mediaMatchers);
    };
};

export function useMediaQuery(mediaQuery: string): boolean {
    
    const useMediaQueryHook = useInitMediaQuery();

    return useMediaQueryHook(mediaQuery);
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

    const expressionValueInPixel = getDimensionValueInNumbers(value);

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

    const mediaMatcher = mediaMatchers[mediaMatcherType as MediaMatchersKeys] as DimensionMediaQueryHook;

    const isMathcing = mediaMatcher(expressionValueInPixel);

    return isMathcing;
};

function getDimensionValueInNumbers(dimensionValue: string): number {

    const [ valueInStr ] = dimensionValue.split(/(?=px)/).filter(item => !!item && item.length === 0);

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

    const mediaMatcher = mediaMatchers[mediaMatcherType as MediaMatchersKeys] as AspectMediaQueryHook;

    const [widthRatioStr, heightRatioStr] = value.split("/");

    const widthRatioNumber = Number(widthRatioStr);

    const heightRatioNumber = Number(heightRatioStr);

    const isMathcing = mediaMatcher([ widthRatioNumber, heightRatioNumber ]);

    return isMathcing;
};