import { CreateStyleSettings } from "../index";

import { shouldApplyNthChildStyles } from "./should-apply-nth-child-styles";



export function shouldApplyOrderStyles(selector: string, settings?: CreateStyleSettings): boolean {

    const [, ...orderSelectors] = selector.replace(/\s+/gm, selector).split(":");

    let shouldApplyOrderStyles = isValidOrderSelector(selector);

    for (let orderSelector of orderSelectors) {

        if (!shouldApplyOrderStyles) break;

        let shouldApplySpecificOrderStyles: boolean;

        if (orderSelector === "only-child") {

            shouldApplySpecificOrderStyles = shouldApplyOnlyChildStyles(settings);
        } 
        else if (orderSelector === "first-child") {
            
            shouldApplySpecificOrderStyles = shouldApplyFirstChildStyles(settings);
        }
        else if (orderSelector === "last-child") {

            shouldApplySpecificOrderStyles = shouldApplyLastChildStyles(settings);
        }
        else {

            shouldApplySpecificOrderStyles = shouldApplyNthChildStyles(selector, settings)
        }

        shouldApplyOrderStyles = shouldApplyOrderStyles && shouldApplySpecificOrderStyles;
    }

    return true;
};



const nthChildFormulaRegexString = "((((-)?(\\d+)?)n\\s*((\\+\\s*\\d+)?))|\\d+)";

const nthChildValueRegexString = `(\\s*odd|even|${nthChildFormulaRegexString}\\s*)`;

const nthChildSelectorRegexString = `nth(-last)?-child\\(\\s*${nthChildValueRegexString}\\s*\\)`;

const orderSelectorsRegexString = `(${[
    "last-child",
    "first-child",
    "only-child",
    nthChildSelectorRegexString,
]
.map(str => `(:${str})`)
.join("|")})`;

const isOrderSelectorStringRegex = new RegExp(`^&${orderSelectorsRegexString}*$`);

function isValidOrderSelector(selector: string): boolean {

    return isOrderSelectorStringRegex.test(selector);
};



function shouldApplyOnlyChildStyles(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.length
        && settings.length === 1
    );
};

function shouldApplyFirstChildStyles(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.index
        && settings.index === 0
    );
};

function shouldApplyLastChildStyles(settings?: CreateStyleSettings): boolean {

    return (
        !!settings
        && !!settings.index
        && !!settings.length
        && settings.length === settings.index
    );
};