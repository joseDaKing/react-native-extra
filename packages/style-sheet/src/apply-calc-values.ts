import { BaseStyle } from "./use-style";

import { UseCalc } from "@react-native-extra/calculate";



export function applyCalcValues(style: BaseStyle, calc: UseCalc): void {

    for (const key in style) {

        const styleKey = key as keyof typeof style;

        const styleValue = style[styleKey]
        
        if (typeof styleValue === "string") {
            
            try {
                style[styleKey] = calc(styleValue) as any;
            }
            catch {}
        }
    }
};