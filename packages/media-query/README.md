<div id="media-query"></div>

# Media query

This library contains media query hooks and media query components that can ease the development of responsive design in react native and react.

<br>

---
## Sections

The library is divided in 4 parts:

1. useMediaQuery hook and OnMediaQuery component

2. Create media query hooks and components from string

3. Create media query hooks and components from context  

<br>

### useMediaQuery hook and OnMediaQuery component
---
Example on how to use useMediaQuery hook and OnMediaQuery component
```tsx
import React from "react";

import { View, Text } from "react-native";

import { useMediaQuery, OnMediaQuery } from "@react-native-extra/media-query";



export const Root = () => {

    const isPortrait = useMediaQuery("(orientation: portrait)");

    return (
        <>
            <Text>
                {isPortrait 
                ? "Portrait" 
                : "Landscape"}
            </Text>

            <OnMediaQuery 
            query="(orientation: portrait)">
                <Text>
                    Portrait
                </Text>
            </OnMediaQuery>
        </>
    );
};
```

<br>

### Create media query hooks and components from string
---
You could also create media query components or hooks from strings

```tsx
import React from "react";

import { View } from "react-native";

import { 
    createMediaQueryHookFromString,
    createMediaQueryComponetFromString,
} 
from "@react-native-extra/media-query";



const OnLaptop = createMediaQueryComponetFromString("(min-width: 1128px)");

const useOnLaptop = createMediaQueryHookFromString("(min-width: 1128px)");

export const Root = () => {

    const isOnLaptop = useOnLaptop();

    return (
        <>
            <Text>
                {isOnLaptop 
                ? "On laptop" 
                : "Not on laptop"}
            </Text>

            <OnLaptop>
                <Text>
                    Laptop
                </Text>
            </OnLaptop>
        </>
    );
};
```

<br>

### Create media query hooks and components from context
---
You could also create media query components or hooks from a context. 
The context must be an object. That has property named breakpoints. 
The breakpoint property has the value of an object whose keys are the breakpoint name and values are media query string.

```tsx
import React, { createContext } from "react";

import { View } from "react-native";

import { 
    createMediaQueryHookFromContext,
    createMediaQueryComponetFromContext
} 
from "@react-native-extra/media-query";




const ThemeContext = createContext({
    breakpoints: {
        portrait: "(orientation: portrait)",
        landscape: "(orientation: landscape)",
    }
});

const useOnBreakpoint = createMediaQueryHookFromContext(ThemeContext);

const OnBreakpoint = createMediaQueryComponetFromContext(ThemeContext);

export const Root = () => {

    const isPortrait = useOnBreakpoint("portrait");

    const isLandscape = useOnBreakpoint("landscape");

    return (
        <>
            {isPortrait &&
            <Text>
                Portrait
            <Text>}

            {isLandscape &&
            <Text>
                Landscape
            <Text>}


            <OnBreakpoint 
            breakpoint="portrait">
                <Text>
                    Portrait
                </Text>
            </OnBreakpoint>

            <OnBreakpoint
            breakpoint="landscape">
                <Text>
                    Landscape
                </Text>
            </OnBreakpoint>
        </>
    );
};
```