import { useMemo } from "react";

import { useCssUnits } from "./css-unit-hooks";

import { computeCssNumberValue} from "./css-number-value-hooks";

import calculate from "calc-units";



export type  UseCssCalc = (expression: string) => number;

export const useInitCssCalc = (): UseCssCalc => {
    
    const units = useCssUnits();

    const useCalc: UseCssCalc = (expression: string): number => {

        return calculate(expression, value => computeCssNumberValue(value, units));
    };

    return useCalc;
};

export const useCssCalc: UseCssCalc = expression => {

    const calc = useInitCssCalc();

    return useMemo(() => calc(expression), [ expression ]);
};