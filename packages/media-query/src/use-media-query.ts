import { 
    parse as parseMediaQuery,
    AST as MediaQuerAST,
    Expression,
    QueryNode
}
from "css-mediaquery";

import { 
    useHeight, 
    useMaxHeight,
    useMinheight,
    useWidth,  
    useMaxWidth, 
    useMinWidth,
    useAspectRatio,
    useMaxAspectRatio,
    useMinAspectRatio, 
    useOrientation, 
    usePlatform, 
    usePrefersColorScheme, 
    useInvertedColors,
    usePrefersReducedMotion,
    AspectMediaQueryHook,
    DimensionMediaQueryHook
} 
from "./media-query-hooks";

import { isValidMediaQueryAst } from "./is-valid-media-query-ast";

import { useMemo } from "react";



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

export const useInitMediaQuery = (): UseMediaQuery => {

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

export const useMediaQuery: UseMediaQuery = mediaQuery => {
    
    const useMediaQueryHook = useInitMediaQuery();

    return useMemo((): boolean => {
        
        return useMediaQueryHook(mediaQuery);
    }, [ mediaQuery ]);
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