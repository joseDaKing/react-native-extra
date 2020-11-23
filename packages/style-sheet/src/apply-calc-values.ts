import { BaseStyle } from "./use-style-factory";

import { UseCalc } from "@react-native-extra/calculate";



export function applyCalcValues(style: BaseStyle, calc: UseCalc): void {

    for (const key in style) {

        const styleKey = key as keyof typeof style;

        const styleValue = style[styleKey]

        if (isCalcValue(styleValue)) {
            
            style[styleKey] = calc(key) as any
        }
    }
};



function isCalcValue(value: any): boolean {

    return (
        typeof value === "string" 
        && !isPercentageValue(value) 
        && isCalcExpression(value)
    );
};



const isPercentageValueRegex = /^\d+%$/;

function isPercentageValue(value: string): boolean {

    return isPercentageValueRegex.test(value);
};



const unitsRegexString = [ "px", "vh", "vw", "vmax", "vmin", "mm", "cm", "in", "pt", "pc", "rem" ].join("|");

const unitValueRegexString = `\\d+(${unitsRegexString})?`;

const unitValueOperationsRegexString = "\\+|-|\\/|\\*";

const isLeftParenthesesRegexString = "(\\()*";

const isRightParenthesesRegexString = "(\\))*";

const isCalcExpressionRegex = new RegExp(`^(\\s*(${isLeftParenthesesRegexString})(${unitValueRegexString})${isRightParenthesesRegexString}\\s*((${unitValueOperationsRegexString})\\s*${isLeftParenthesesRegexString}(${unitValueRegexString})${isRightParenthesesRegexString}\\s*)*)$`); 

function isCalcExpression(value: string): boolean {

    return isCalcExpressionRegex.test(value);
};