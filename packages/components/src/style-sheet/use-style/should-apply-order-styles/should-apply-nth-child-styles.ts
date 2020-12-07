import { CreateStyleSettings } from "../index";

import { hasValidNthChildFormula } from "./has-valid-nth-child-formula";



export function shouldApplyNthChildStyles(selector: string, settings?: CreateStyleSettings): boolean {

    const [type, nthChildValue] = extractTypeAndNthFormula(selector);    

    return (
        hasValidNthChildSettings(type, settings)
        && hasValidNthChildValue(type, nthChildValue, settings as Required<CreateStyleSettings>)
    );
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



type NthChildType = "nth-child" | "nth-last-child";

type TypeAndFormulaTuple = [nthChildType: NthChildType, nthChildValue: string];

const extractTypeAndNthFormulaRegex = /[\(\)]/;

function extractTypeAndNthFormula(selector: string): TypeAndFormulaTuple {

    return selector.split(extractTypeAndNthFormulaRegex) as TypeAndFormulaTuple;
};



function hasValidNthChildValue(type: NthChildType, nthChildValue: string, settings: Required<CreateStyleSettings>): boolean {

    const nthChildFormula = toNthChildFormula(nthChildValue);

    const index = getNthChildIndex(type, settings);

    return hasValidNthChildFormula(index, nthChildFormula);;
};

function toNthChildFormula(nthChildValue: string): string {

    let nthChildFormula: string;

    if (nthChildValue === "odd") {

        nthChildFormula = "2n+1";
    }
    else if (nthChildValue === "even") {
        
        nthChildFormula = "2n";
    }
    else {
        nthChildFormula = nthChildValue;
    }

    return nthChildFormula;
};

function getNthChildIndex(type: NthChildType, settings: Required<CreateStyleSettings>): number {

    let index: number;

    if (type === "nth-child") {

        index = settings.index;
    }
    else {

        index = settings.length - settings.index;
    }

    return index;
};