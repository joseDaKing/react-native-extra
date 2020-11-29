import {
    BaseStyle,
    BaseStyleProps,
    CreateStyleSettings
} 
from "./use-style";

import { UseMediaQuery } from "@react-native-extra/media-query";



export type OrderSelector = (
    "&:last-child" 
    | "&:first-child" 
    | "&:nth-child(even)"
    | "&:nth-child(odd)"
    | "&:nth-last-child(even)"
    | "&:nth-last-child(odd)"
);

export function applyStyleProps(styleProps: BaseStyleProps<BaseStyle>, style: BaseStyle, mediaQuery: UseMediaQuery, settings?: CreateStyleSettings) {

    for (const key in styleProps) {

        const stylePropKey = key as keyof typeof styleProps;

        const stylePropValue = styleProps[stylePropKey];
        
        if (shouldApplyNestedStyles(stylePropKey, mediaQuery, settings)) {

            applyStyleProps(styleProps[stylePropKey] as typeof styleProps, style, mediaQuery, settings);
        }
        else {

            style[stylePropKey as keyof BaseStyle] = stylePropValue as any;
        }
    }
};



function shouldApplyNestedStyles(stylePropKey: string, mediaQuery: UseMediaQuery, settings?: CreateStyleSettings): boolean {

    const stylePropKeyWithoutWhiteSpace = removeWhiteSpace(stylePropKey);

    return (
        mediaQuery(stylePropKeyWithoutWhiteSpace)
        || (
            isValidOrderSelectorString(stylePropKeyWithoutWhiteSpace) 
            && isValidOrderSelector(stylePropKeyWithoutWhiteSpace, settings)
        )
    );
};



const nthChildFormulaRegexString = "((((-)?(\\d+)?)n\\s*((\\+\\s*\\d+)?))|\\d+)";

const nthChildValueRegexString = `(\\s*odd|even|${nthChildFormulaRegexString}\\s*)`;

const orderSelectorsRegexString = `(${[
    "last-child",
    "first-child",
    "only-child",
    `nth(-last)?-child\\(\\s*${nthChildValueRegexString}\\s*\\)`,
].map(str => `(:${str})`).join("|")})`;

const isOrderSelectorStringRegex = new RegExp(`^&${orderSelectorsRegexString}*$`);

export function isValidOrderSelectorString(value: string): boolean {

    return isOrderSelectorStringRegex.test(value);
};



const removeWhiteSpaceRegex = /\s+/gi;

function removeWhiteSpace(value: string): string {

    return value.replace(removeWhiteSpaceRegex, "");
};



function isValidOrderSelector(selector: string, settings?: CreateStyleSettings): boolean {

    const [, ...orderSelectors] = selector.replace(/\s+/gm, selector).split(":");

    let isValidOrderSelector = true;

    for (let orderSelector of orderSelectors) {

        if (!isValidOrderSelector) break;

        if (orderSelector === "only-child") {

            isValidOrderSelector = (
                isValidOrderSelector  
                && isValidOnlyChildSelector(settings)
            );
        } 
        else if (orderSelector === "first-child") {

            isValidOrderSelector = (
                isValidOrderSelector  
                && isValidFirstChildSelector(settings)
            );
        }
        else if (orderSelector === "last-child") {

            isValidOrderSelector = (
                isValidOrderSelector  
                && isValidLastChildSelector(settings)
            );
        }
        else {

            isValidOrderSelector = (
                isValidOrderSelector
                && isValidNthChildSelector(selector, settings)
            );
        }
    }

    return true;
};



function isValidOnlyChildSelector(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.length
        && settings.length === 1
    );
};



function isValidFirstChildSelector(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.index
        && settings.index === 0
    );
};



function isValidLastChildSelector(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.index
        && !!settings.length
        && settings.length === settings.index
    );
};



function isValidNthChildSelector(selector: string, settings?: CreateStyleSettings): boolean {

    const [type, nthChildValue] = extractTypeAndNthFormula(selector);    

    return (
        hasValidNthChildSettings(type, settings)
        && hasValidNthChildValue(type, nthChildValue, settings as Required<CreateStyleSettings>)
    );
};



function hasValidNthChildValue(type: NthChildType, nthChildValue: string, settings: Required<CreateStyleSettings>): boolean {

    let nthChildFormula: string;

    if (nthChildValue === "odd") {

        nthChildFormula = "2n+1";
    }
    else if (nthChildValue === "even") {
        
        nthChildFormula = "2n";
    }

    nthChildFormula = nthChildValue;

    const index = getIndexForNthChild(type, settings);

    return hasValidNthChildFormula(index, nthChildFormula);;
};



function hasValidNthChildFormula(index: number, nthChildFormula: string): boolean {

    const { a, b } = extractNthChildFormulaValues(nthChildFormula);

    const value = (index - b)/a;

    return Number.isInteger(value);
};



type NthChildValue = {
    a: number;
    b: number;
};

function extractNthChildFormulaValues(nthChildFormula: string): NthChildValue {

    const tokens = extractNthChildFormulaTokens(nthChildFormula);

    const nthChildValue: NthChildValue = {
        a: 0,
        b: 0
    };

    const nToken = tokens.find(isNToken);

    const aToken = tokens.find(isAToken);

    const bToken = tokens.find(isBToken);

    if (!nToken) {
        
        nthChildValue.b = Number(tokens[0]);
    }
    else {

        if (aToken) {

            if (aToken === "-") {

                nthChildValue.a = -1;
            }
            else {

                nthChildValue.a = Number(aToken);
            }
        }
        else {

            nthChildValue.a = 1;
        }

        if (bToken) {

            nthChildValue.b = Number(bToken.split("+")[1]);
        }
        else {

            nthChildValue.b = 0;
        }
    }

    return nthChildValue;
};



const isATokenRegex = /^((-)?\d+)|-$/;

function isAToken(token: string): boolean {

    return isATokenRegex.test(token);
};



const isBTokenRegex = /^\+\d+$/;

function isBToken(token: string): boolean {

    return isBTokenRegex.test(token);
};



function isNToken(token: string): boolean {

    return token === "n";
};



const extractNthChildFormulaTokensRegex = /(?=n)|(?<=n)/;

function extractNthChildFormulaTokens(nthChildFormula: string): string[] {

    return nthChildFormula.split(extractNthChildFormulaTokensRegex);
};



function getIndexForNthChild(type: NthChildType, settings: Required<CreateStyleSettings>): number {

    let index: number;

    if (type === "nth-child") {

        index = settings.index;
    }
    else {

        index = settings.length - settings.index;
    }

    return index;
}



type NthChildType = "nth-child" | "nth-last-child";

type TypeAndFormulaTuple = [nthChildType: NthChildType, nthChildValue: string];

const extractTypeAndNthFormulaRegex = /[\(\)]/;

function extractTypeAndNthFormula(selector: string): TypeAndFormulaTuple {

    return selector.split(extractTypeAndNthFormulaRegex) as TypeAndFormulaTuple;
};



function hasValidNthChildSettings(type: NthChildType, settings?: CreateStyleSettings): boolean {
    
    let hasValidNthChildSettings = true;

    if (type === "nth-child") {

        hasValidNthChildSettings = (
            !!settings 
            && !!settings.index
        );
    }
    else {

        hasValidNthChildSettings = (
            !!settings
            && !!settings.length
            && !!settings.index
        );
    }

    return hasValidNthChildSettings;
};