import "@react-native-extra/match-media";

import { Context, useContext } from "react";

import { useEffect, useState } from "react";

import { BreakpointsContextValue } from "./types";



export type UseMediaQuery = (query: string) => boolean;

type Listener = (arg: any) => any;

export const useMediaQuery: UseMediaQuery = mediaQuery => {

    const mediaQueryList = matchMedia(mediaQuery);

    const [isMatching, setIsMatching] = useState(mediaQueryList.matches);

    const listener: Listener = ({ matches }) => setIsMatching(matches);

    useEffect(() => {

        mediaQueryList.addEventListener("change", listener);

        return () => {
        
            mediaQueryList.removeEventListener("change", listener);
        };

    }, []);
    
    return isMatching;
};



export const createMediaQueryHookFromContext = <ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>) => {

    return (breakpoint: keyof ContextValue["breakpoints"]) => {

        const { breakpoints } = useContext(context);

        const mediaQueryString = breakpoints[breakpoint as string];

        const isMatching = useMediaQuery(mediaQueryString);

        return isMatching;
    };
};



export const createMediaQueryHookFromString = (mediaQuery: string) => {

    return () => {

        const isMatching = useMediaQuery(mediaQuery);

        return isMatching;
    };
};



export const useIsIosPlatform = createMediaQueryHookFromString("(platform: ios)");

export const useIsAndroidPlatform = createMediaQueryHookFromString("(platform: android)");

export const useIsWindowsPlatform = createMediaQueryHookFromString("(platform: windows)");

export const useIsMacosPlatform = createMediaQueryHookFromString("platform: macos");

export const useIsWebPlatform = createMediaQueryHookFromString("(platform: web)");

export const useIsLightTheme = createMediaQueryHookFromString("(prefers-color-scheme: light)");

export const useIsDarkTheme = createMediaQueryHookFromString("(prefers-color-scheme: dark)");

export const useIsLandscape = createMediaQueryHookFromString("(orientation: landscape)");

export const useIsPortrait = createMediaQueryHookFromString("(orientation: portrait)");

export const usePrefersReducedMotion = createMediaQueryHookFromString("(prefers-reduced-motion: reduced)");

export const usePrefersReducedTransparency = createMediaQueryHookFromString("(prefers-reduced-transparency: reduced)");

export const useIsInvertedColors = createMediaQueryHookFromString("(inverted-colors: inverted)");