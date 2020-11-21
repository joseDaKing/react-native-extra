import React, { Context, useContext } from "react";

import { AspectRatio } from "./types"

import { useMediaQuery } from "./media-query-hooks";



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

export const OnPrefersReducedMotion = mediaQueryComponetFromStringFactory("prefers-reduced-motion: reduced");

export const OnInvertedColors = mediaQueryComponetFromStringFactory("inverted-colors: inverted");



type OnMediaQueryProps = {
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    aspectRatio?: AspectRatio;
    minAspectRatio?: AspectRatio;
    maxAspectRatio?: AspectRatio;
    invertedColors?: "none" | "inverted";
    prefersReducedMotion?: "reduce" | "no-preference"; 
    platform?: "ios" | "android" | "mobile" | "web";
    orentation?: "portrait" | "landscape";
    prefersColorScheme?: "dark" | "light";
}

export const OnMediaQuery: React.FC<OnMediaQueryProps> = props => {

    const { children, ...mediaQueries } = props;

    const mediaQueryString = createMediaQueryStringFromProps(mediaQueries);

    const isMatching = useMediaQuery(mediaQueryString);

    return (
        <>
            {isMatching && children}
        </>
    );
};

type MediaQueryStrings = {
    [Key in keyof OnMediaQueryProps]: string;
}

function createMediaQueryStringFromProps(props: OnMediaQueryProps): string {

    const mediaQueryStrings: MediaQueryStrings = {};

    applyAspectRatioMediaQueryStrings(mediaQueryStrings, props);

    applyHeightMediaQueryStrings(mediaQueryStrings, props);

    applyWidthMediaQueryStrings(mediaQueryStrings, props);

    const completeMediaQueryString = Object.values(mediaQueryStrings).join(" and ").trim();

    return completeMediaQueryString;
};

function applyHeightMediaQueryStrings(mediaQueryStrings: MediaQueryStrings, props: OnMediaQueryProps): void {

    if (props.height) {

        mediaQueryStrings.height = `(height: ${props.height}px)`;
    }

    if (props.minHeight) {

        mediaQueryStrings.minHeight = `(min-height: ${props.minHeight}px)`;
    }

    if (props.maxHeight) {

        mediaQueryStrings.maxHeight = `(max-height: ${props.maxHeight}px)`;
    }
};

function applyWidthMediaQueryStrings(mediaQueryStrings: MediaQueryStrings, props: OnMediaQueryProps): void {

    if (props.width) {

        mediaQueryStrings.width = `(width: ${props.width}px)`;
    }

    if (props.minWidth) {

        mediaQueryStrings.minWidth = `(min-width: ${props.minWidth}px)`;
    }

    if (props.maxWidth) {

        mediaQueryStrings.maxWidth = `(max-width: ${props.maxWidth}px)`;
    }
};

function applyAspectRatioMediaQueryStrings(mediaQueryStrings: MediaQueryStrings, props: OnMediaQueryProps): void {

    if (props.aspectRatio) {

        mediaQueryStrings.aspectRatio = `(aspect-ratio: ${getAspectRatioInString(props.aspectRatio)})`;
    };

    if (props.maxAspectRatio) {

        mediaQueryStrings.aspectRatio = `(aspect-ratio: ${getAspectRatioInString(props.maxAspectRatio)})`;
    }

    if (props.minAspectRatio) {

        mediaQueryStrings.aspectRatio = `(aspect-ratio: ${getAspectRatioInString(props.minAspectRatio)})`;
    }
};

function getAspectRatioInString(aspectRatio: AspectRatio): string {

    const [widthRatio, heightRatio] = aspectRatio;

    return `${widthRatio}/${heightRatio}`;
};