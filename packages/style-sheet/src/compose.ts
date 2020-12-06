import {
    StyleType,
    StyleProps
}
from "./use-style";



type StylePropsValues<Type extends StyleType> = StyleProps<Type>[keyof StyleProps<Type>];

type NestedStylePropsArray<Type extends StyleType> = Array<StyleProps<Type> | NestedStylePropsArray<Type>>;

export function compose<Type extends StyleType>(styleProps: NestedStylePropsArray<Type>): void {

    const [first, ...rest] = flattenArray<Type>(styleProps);

    for (const current of rest) {
        
        composeTwo<Type>(first, current);
    }
};



function flattenArray<Type extends StyleType>(nestedStylePropsArray: NestedStylePropsArray<Type>): StyleProps<Type>[] {

    const stylePropsArray: StyleProps<Type>[] = [];
    
    flattenRecursive<Type>(stylePropsArray, nestedStylePropsArray);
    
    return stylePropsArray;
};

function flattenRecursive<Type extends StyleType>(stylePropsArray: StyleProps<Type>[], nestedStylePropsArray: NestedStylePropsArray<Type>) {
    
    for (const item of nestedStylePropsArray) {

        const isNestedStylePropsArray = Array.isArray(item);

        if (isNestedStylePropsArray) {
         
            flattenRecursive<Type>(stylePropsArray, item as NestedStylePropsArray<Type>);
        }            

        const isStyleProps = !isNestedStylePropsArray;

        if (isStyleProps) {

            stylePropsArray.push(item as StyleProps<Type>);
        }
    }
};



function composeTwo<Type extends StyleType>(styleProps1: StyleProps<Type>, styleProps2: StyleProps<Type>): void {

    for (const key in styleProps2) {

        const stylePropKey = key as keyof StyleProps<Type>;
        
        const stylePropValue1 = styleProps1[stylePropKey];

        const stylePropValue2 = styleProps2[stylePropKey];

        const isMediaQuery = !!key.match("@media");

        const isSelector = !!key.match("&:");

        const isNested = isMediaQuery && isSelector;

        mergeProp<Type>(styleProps1, stylePropKey, stylePropValue1, stylePropValue2, isNested);

        mergeNestedProps<Type>(stylePropValue1,stylePropValue2, isNested);
    }
};



function mergeNestedProps<Type extends StyleType>(
    stylePropValue1: StylePropsValues<Type>, 
    stylePropValue2: StylePropsValues<Type>, 
    isNested: boolean
): void {

    if (shouldMergeNestedProps<Type>(stylePropValue1, stylePropValue2, isNested)) {
     
        composeTwo<Type>(
            stylePropValue1 as StyleProps<Type>,
            stylePropValue2 as StyleProps<Type>
        );
    }
};

function shouldMergeNestedProps<Type extends StyleType>(
    stylePropValue1: StylePropsValues<Type>, 
    stylePropValue2: StylePropsValues<Type>, 
    isNested: boolean
): boolean {

    return (
        stylePropValue1 
        && stylePropValue2 
        && isNested
    );
};



function mergeProp<Type extends StyleType>(
    styleProps1: StyleProps<Type>,
    stylePropKey: keyof StyleProps<Type>,
    stylePropValue1: StylePropsValues<Type>, 
    stylePropValue2: StylePropsValues<Type>, 
    isNested: boolean
): void {

    if (shouldMergeProp<Type>(stylePropValue1, stylePropValue2, isNested)) {

        styleProps1[stylePropKey] = stylePropValue2;
    }
};

function shouldMergeProp<Type extends StyleType>(
    stylePropValue1: StylePropsValues<Type>, 
    stylePropValue2: StylePropsValues<Type>, 
    isNested: boolean
): boolean {

    return (
        (
            stylePropValue2 
            && !isNested
        )
        || (
            !stylePropValue1 
            && stylePropValue2 
            && isNested
        )
    );
};