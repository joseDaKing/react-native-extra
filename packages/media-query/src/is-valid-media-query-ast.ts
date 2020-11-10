import {  AST as MediaQuerAST } from "css-mediaquery";



export function isValidMediaQueryAst(mediaQueryAST: MediaQuerAST): boolean {

    try {
        return (
            isValidQueryNodeType(mediaQueryAST)
            && isValidQueryNodeExpressions(mediaQueryAST)
        );
    }
    catch {
        return false;
    }
};

const isPxRegex = /^\d+(px|rem)$/;

function isValidQueryNodeExpressions(mediaQueryAST: MediaQuerAST): boolean {

    let isValidQueryNodeExpressions = true;

    for (const queryNode of mediaQueryAST) {

        for (const expression of queryNode.expressions) {

            const { modifier, value, feature } = expression;

            const isValidMediaQueryExpression = (
                isValidDimension(feature, modifier, value)
                || isValidOrientation(feature, modifier, value)
                || isValidPlatform(feature, modifier, value)
                || isValidPrefersColorScheme(feature, modifier, value)
                || isValidAspectRatio(feature, modifier, value)
                || isValidPrefersReducedMotion(feature, modifier, value)
                || isValidInvertedColors(feature, modifier, value)
            );

            isValidQueryNodeExpressions = isValidQueryNodeExpressions && isValidMediaQueryExpression;

            if (!isValidQueryNodeExpressions) break;
        }

        return isValidQueryNodeExpressions;
    }

    return true;
};

function isValidAspectRatio(feature: string, modifier: string, value: string): boolean {
    return (
        isModifierMinMax(modifier)
        && feature === "aspect-ratio"
        && isValidAspectRatioString(value)
    );
};

function isValidAspectRatioString(aspectRatio: string): boolean {
    
    const result = aspectRatio.split("/");

    const [startNumberInStr, endNumberInStr] = result;

    const isValid = (
        (result.length === 2)
        && !isNaN(Number(startNumberInStr))
        && !isNaN(Number(endNumberInStr))
    );

    return isValid;
};

function isValidPrefersReducedMotion(feature: string, modifier: string, value: string): boolean {

    return (
        typeof modifier === "undefined"
        && feature === "prefers-reduced-motion"
        && (
            value === "reduce"
            || value === "no-preference"  
        )
    );
};

function isValidInvertedColors(feature: string, modifier: string, value: string): boolean {

    return (
        typeof modifier === "undefined"
        && feature === "inverted-colors"
        && (
            value === "inverted"
            || value === "none"
        )
    );
};

function isValidDimension(feature: string, modifier: string, value: string): boolean {

    return (
        isModifierMinMax(modifier)
        && (
            (
                feature === "width"
                && isPxRegex.test(value)
            )
            || (
                feature === "height" 
                && isPxRegex.test(value)
            )
        )
    );
};

function isModifierMinMax(modifier: string): boolean {
    
    return (
        modifier === "min"
        || modifier === "max"
        || typeof modifier === "undefined"
    );
};

function isValidOrientation(feature: string, modifier: string, value: string): boolean {
    return (
        feature === "orientation"
        && typeof modifier === "undefined"
        && (
            value === "portrait"
            || value === "landscape"
        )
    );
};

function isValidPlatform(feature: string, modifier: string, value: string): boolean {

    return (
        feature === "platform"
        && typeof modifier === "undefined"
        && (
            value === "ios"
            || value === "android"
            || value === "web"
            || value === "mobile"
        )
    );
};

function isValidPrefersColorScheme(feature: string, modifier: string, value: string): boolean {
    return (
        feature === "prefers-color-scheme"
        && typeof modifier === "undefined"
        && (
            value === "dark"
            || value === "light"
        )
    );
};

function isValidQueryNodeType(mediaQueryAST: MediaQuerAST): boolean {

    let isValidQueryNodeType = true;

    for (const queryNode of mediaQueryAST) {

        isValidQueryNodeType = isValidQueryNodeType && queryNode.type === "all";

        if (isValidQueryNodeType) break;
    }

    return isValidQueryNodeType;
};