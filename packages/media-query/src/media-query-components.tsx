import React, { Context, useContext } from "react";

import { useMediaQuery } from "./use-media-query";



export type BreakpointsContextValue = {
    breakpoints: Record<string, string>;
}

type MediaQueryComponentFromContextProps<ContextValue extends BreakpointsContextValue> = {
    type: keyof ContextValue["breakpoints"]
}

export function mediaQueryComponentFromContextFactory<ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>): React.FC<MediaQueryComponentFromContextProps<ContextValue>> {
    
    const OnBreakpoints: React.FC<MediaQueryComponentFromContextProps<ContextValue>> = ({ type, children }) => {

        const { breakpoints } = useContext(context);

        const mediaQueryString = breakpoints[type as string];

        const isMatching = useMediaQuery(mediaQueryString);

        return (
            <>
                {isMatching && children}
            </>
        );
    };

    
    return OnBreakpoints;
};

export function mediaQueryComponetFromStringFactory(mediaQuery: string): React.FC {
    
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

export const OnIosPlatform = mediaQueryComponetFromStringFactory("(platform: ios)");

export const OnAndroidPlatform = mediaQueryComponetFromStringFactory("(platform: android)");

export const OnMobilePlatform = mediaQueryComponetFromStringFactory("(platform: mobile)");

export const OnDesktopPlatform = mediaQueryComponetFromStringFactory("platform: desktop");

export const OnWebPlatform = mediaQueryComponetFromStringFactory("(platform: web)");

export const OnLightTheme = mediaQueryComponetFromStringFactory("(prefers-color-scheme: light)");

export const OnDarkTheme = mediaQueryComponetFromStringFactory("(prefers-color-scheme: dark)");

export const OnLandscape = mediaQueryComponetFromStringFactory("(orientation: landscape)");

export const OnPortrait = mediaQueryComponetFromStringFactory("(orientation: portrait)");

export const OnPrefersReducedMotion = mediaQueryComponetFromStringFactory("(prefers-reduced-motion: reduced)");

export const OnInvertedColors = mediaQueryComponetFromStringFactory("(inverted-colors: inverted)");



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