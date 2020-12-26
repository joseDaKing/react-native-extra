import React, { Context, useContext } from "react";

import { useMediaQuery } from "./use-media-query";

import { BreakpointsContextValue } from "./types";



type CreateMediaQueryComponentFromContextProps<ContextValue extends BreakpointsContextValue> = {
    breakpoint: keyof ContextValue["breakpoints"]
}

export function createMediaQueryComponentFromContext<ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>): React.FC<CreateMediaQueryComponentFromContextProps<ContextValue>> {
    
    const OnBreakpoints: React.FC<CreateMediaQueryComponentFromContextProps<ContextValue>> = ({ breakpoint, children }) => {

        const { breakpoints } = useContext(context);

        const mediaQueryString = breakpoints[breakpoint as string];

        const isMatching = useMediaQuery(mediaQueryString);

        return (
            <>
                {isMatching && children}
            </>
        );
    };

    
    return OnBreakpoints;
};



export function createMediaQueryComponetFromString(mediaQuery: string): React.FC {
    
    const OnMediaQuery: React.FC = ({ children }: any) => {

        const isMatching = useMediaQuery(mediaQuery);

        return (
            <>
                {isMatching && children}
            </>
        );
    };

    return OnMediaQuery;
};



export const OnIosPlatform = createMediaQueryComponetFromString("(platform: ios)");

export const OnAndroidPlatform = createMediaQueryComponetFromString("(platform: android)");

export const OnWindowsPlatform = createMediaQueryComponetFromString("(platform: windows)");

export const OnMacosPlatform = createMediaQueryComponetFromString("platform: macos");

export const OnWebPlatform = createMediaQueryComponetFromString("(platform: web)");

export const OnLightTheme = createMediaQueryComponetFromString("(prefers-color-scheme: light)");

export const OnDarkTheme = createMediaQueryComponetFromString("(prefers-color-scheme: dark)");

export const OnLandscape = createMediaQueryComponetFromString("(orientation: landscape)");

export const OnPortrait = createMediaQueryComponetFromString("(orientation: portrait)");

export const OnPrefersReducedMotion = createMediaQueryComponetFromString("(prefers-reduced-motion: reduced)");

export const OnInvertedColors = createMediaQueryComponetFromString("(inverted-colors: inverted)");



type OnMediaQueryProps = {
    query: string;
}

export const OnMediaQuery: React.FC<OnMediaQueryProps> = props => {

    const isMatching = useMediaQuery(props.query);

    return (
        <>
            {isMatching && props.children}
        </>
    );
};