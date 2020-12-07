import {
    useState
} 
from "react";

import { 
    LayoutRectangle,
    LayoutChangeEvent, 
} 
from "react-native";


type UseLayoutCallback = (event: LayoutChangeEvent) => void | any;

type UseLayoutReturnType = [layoutValues: LayoutRectangle, useLayoutCallback: UseLayoutCallback];

export function useLayout(): UseLayoutReturnType {

    const [height, setHeight] = useState(0);

    const [width, setWidth] = useState(0);

    const [x, setX] = useState(0);
    
    const [y, setY] = useState(0);

    const onLayoutCb: UseLayoutCallback = event => {

        const { 
            height,
            width,
            x,
            y
        } = event.nativeEvent.layout;

        setHeight(height);

        setWidth(width);

        setX(x);

        setY(y);
    };

    const layoutValues: LayoutRectangle = {
        width,
        height,
        x,
        y
    };

    return [ 
        layoutValues, 
        onLayoutCb 
    ];
};