import { BaseStyle } from "./use-style";

import { UseCalc } from "@react-native-extra/calculate";

import { TransformsStyle } from "react-native";



export function applyCalcValues(style: BaseStyle, calc: UseCalc): void {

    for (const key in style) {

        const styleKey = key as keyof typeof style;

        const styleValue = style[styleKey]
        
        if (styleKey === "transform") {

            const transformStyleArray = styleValue as TransformsStyle["transform"];

            if (transformStyleArray) {

                applyCalcValuesForTransforms(transformStyleArray, calc);
            }
        }
        else if (typeof styleValue === "string") {
            
            try {
                style[styleKey] = calc(styleValue) as any;
            }
            catch {}
        }
    }
};


type TransformArray = Exclude<TransformsStyle["transform"], undefined>;

function applyCalcValuesForTransforms(transformStyleArray: TransformArray, calc: UseCalc): void {

    for (const transformStyle of transformStyleArray) {

        const transformStylePropKey = Object.keys(transformStyle)[0];

        const transformStylePropValue = (transformStyle as any)[transformStylePropKey];

        const isValueString = typeof transformStylePropValue === "string";

        if (isValueString) {

            const isRotation = (
                !!transformStylePropKey.match("rotate") 
                || !!transformStylePropKey.match("skew")
            );

            if (isRotation) {
                
            }



            const isTranslation = !!transformStylePropKey.match("translate");

            const isPerspective = transformStylePropKey === "perspective";

            if (isTranslation || isPerspective) {

                (transformStyle as any)[transformStylePropKey] = calc(transformStylePropValue);
            }
        }
    }
}