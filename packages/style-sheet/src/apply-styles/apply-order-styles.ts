import { 
    OrderVariantSettings, 
    BaseStyle,
    StyleProps
}
from "../use-style";

import { composeStyleProps } from "../compose-styles";



export type OrderSelector = (
    "&:first-child" 
    | "&:last-child" 
    | "&:only-child" 
    | "&:nth-child(even)" 
    | "&:nth-last-child(even)" 
    | "&:nth-child(odd)" 
    | "&:nth-last-child(odd)" 
);

export function applyOrderStyles<Style extends BaseStyle>(styleProps: StyleProps<Style>, style: Style, orderVariantSettings: OrderVariantSettings): void {

    const stylePropsAsRecord = styleProps as Record<string, any>;

    for (const selector in stylePropsAsRecord) {        

        if (isOrderSelector(selector) && shouldApplyOrderStyles(removeWhiteSpace(selector) as typeof selector, orderVariantSettings)) {

            const nestedStyleProps = {...stylePropsAsRecord[selector]};

            for (const key in nestedStyleProps) {

                if (isOrderSelector(key)) {
                    
                    delete nestedStyleProps[key];
                };
            }

            composeStyleProps([ nestedStyleProps[selector], style ]);

            applyOrderStyles(nestedStyleProps, style, orderVariantSettings);
        }
    }
};


function removeWhiteSpace(value: string): string {

    return value.replace(/\s+/gm, "");
};

function shouldApplyOrderStyles(selector: OrderSelector, { index, length }: OrderVariantSettings): boolean {
    
    const pseudoOrderSelectors = selector.split(":");

    let isValid = true;

    for (const pseudoOrderSelector of pseudoOrderSelectors) {

        if (!isValid) break;
        
        if (pseudoOrderSelector === "only-child") {
            
            isValid = (
                isValid  
                && !!length 
                && (length === 1) 
            );
        }
        else if (/nth-last-child/.test(pseudoOrderSelector)) {
            
            isValid = (
                !!index 
                && !!length 
                && isIndexNthChildFormula(pseudoOrderSelector, length - index)
            );
        }
        else if (/nth-child/.test(pseudoOrderSelector)) {

            isValid = (
                isValid
                && !!index
                && isIndexNthChildFormula(pseudoOrderSelector, index)
            );
        }
        else if (pseudoOrderSelector === "first-child") {

            isValid = (
                isValid 
                && !!index 
                && isIndexNthChildFormula("nth-child(1)", index)
            );
        }
        else if (pseudoOrderSelector === "last-child") {

            isValid = (
                isValid
                && !!index
                && !!length
                && isIndexNthChildFormula(`nth-child(${length})`, index)
            );
        }
    
    }

    return isValid;
};



function isIndexNthChildFormula(nthChildSelector: string, index: number): boolean {

    const nthChildFormula = extractNthChildFormulaString(nthChildSelector);

    const { a, b } = getNthChildFormulaValue(nthChildFormula);    

    if (a === 0) {

        return b === index;
    }
    else {
        
        const n = (index - b) / a;
    
        return (0 <= n) && isInteger(n);
    }
};

function isInteger(value: number): boolean {

    return Math.round(value) === value;
};



const extractNthChildFormulaTokensRegex = /(?=n)|(?<=n)|(?=\+)|(?<=\+)/;

type NthChildFormulaValue = {
    a: number;
    b: number;
}

function getNthChildFormulaValue(nthChildFormula: string): NthChildFormulaValue { 

    const tokens = nthChildFormula.split(extractNthChildFormulaTokensRegex);

    const nTokenIndex = tokens.findIndex(token => token === "n"); 

    const aTokenIndex = nTokenIndex - 1;

    const bTokenIndex = nTokenIndex + 2;

    let a = 0;

    let b = 0;

    if (nTokenIndex < 0) {

        b = Number(tokens[bTokenIndex]);
    }
    else {

        if (aTokenIndex < 0) {
            
            a = Number(tokens[aTokenIndex]);
        }

        if (bTokenIndex < 0) {

            b = Number(tokens[bTokenIndex]);
        }
    }

    return { a, b };
};



const extractNthChildFormulaRegex = /(?<=\()|(?=\))/;

function extractNthChildFormulaString(nthChildSelector: string): string {
    
    const nthChildFormula = nthChildSelector.split(extractNthChildFormulaRegex)[1];

    if (nthChildFormula === "odd") {

        return "2n+1";
    }
    else if (nthChildFormula === "even") {

        return "2n";
    }

    return nthChildFormula;
};



const isNthChildFormulaRegexString = "(-?\\d*?n\\s*(\\+\\s*\\d+)?)|(-?\\d+)";

const isOrderSelectorRegex = new RegExp(`^&(:last-child|:first-child|:only-child|(:nth(-last)?-child\\(\\${isNthChildFormulaRegexString}\)))+$`)

function isOrderSelector(selector: string): selector is OrderSelector {

    return isOrderSelectorRegex.test(selector);
};