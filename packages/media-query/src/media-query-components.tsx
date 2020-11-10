import React, { Context, useContext } from "react";
import { View } from "react-native";

import { AspectRatio } from "./types"

import { useMediaQuery } from "./use-media-query";



export type BreakpointsContextValue = {
    breakpoints: Record<string, string>;
}

export type MediaQueryComponentFromContextProps<ContextValue extends BreakpointsContextValue> = {
    type: keyof ContextValue["breakpoints"]
}

export function createMediaQueryComponentFromContext<ContextValue extends BreakpointsContextValue>(context: Context<ContextValue>): React.FC<MediaQueryComponentFromContextProps<ContextValue>> {
    
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

export const OnMobilePlatform = createMediaQueryComponetFromString("(platform: mobile)");

export const OnDesktopPlatform = createMediaQueryComponetFromString("platform: desktop");

export const OnWebPlatform = createMediaQueryComponetFromString("(platform: web)");

export const OnLightTheme = createMediaQueryComponetFromString("(prefers-color-scheme: light)");

export const OnDarkTheme = createMediaQueryComponetFromString("(prefers-color-scheme: dark)");

export const OnLandscape = createMediaQueryComponetFromString("(orientation: landscape)");

export const OnPortrait = createMediaQueryComponetFromString("(orientation: portrait)");

export const OnPrefersReducedMotion = createMediaQueryComponetFromString("prefers-reduced-motion: reduced");

export const OnInvertedColors = createMediaQueryComponetFromString("inverted-colors: inverted");



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

function createMediaQueryStringFromProps(mediaQueries: OnMediaQueryProps): string {

    let mediaQueryStrings: string[] = [];

    for (const key in mediaQueries) {
        
        const mediaQueryType = key as keyof OnMediaQueryProps;

        let value = mediaQueries[mediaQueryType] as string | number | [number, number];

        if (Array.isArray(value)) {
            
            const [widthRatio, heightRatio] = value;

            value = `${widthRatio}/${heightRatio}`;
 
            switch(mediaQueryType) {
            
                case "aspectRatio":
    
                    mediaQueryStrings.push(`(aspect-ratio: ${value})`);
                break;
                
                case "minAspectRatio":
    
                    mediaQueryStrings.push(`(minAspect-ratio: ${value})`);
                break;
                
                case "maxAspectRatio":
    
                    mediaQueryStrings.push(`(maxAspect-ratio: ${value})`);
                break;
            };
        }
        else if (typeof value === "number") {
            
            value = `${value}px`;

            switch(mediaQueryType) {

                case "height":
                    mediaQueryStrings.push(`(width: ${value})`);
                break;
                
                case "minWidth":

                    mediaQueryStrings.push(`(min-width: ${value})`);
                break;
                
                case "maxWidth":

                    mediaQueryStrings.push(`(max-width: ${value})`);
                break;
                
                case "height":

                    mediaQueryStrings.push(`(height: ${value})`);
                break;
                
                case "minHeight":

                    mediaQueryStrings.push(`(min-height: ${value})`);
                break;
                
                case "maxHeight":

                    mediaQueryStrings.push(`(max-height: ${value})`);
                break;
            };
        }
        else {
            
            switch(mediaQueryType) {
                
                case "invertedColors":

                    mediaQueryStrings.push(`(inverted-colors: ${value})`);
                break;
                
                case "prefersReducedMotion":
    
                    mediaQueryStrings.push(`(prefers-reduced-motion: ${value})`);
                break;
                
                case "platform":
    
                    mediaQueryStrings.push(`(platform: ${value})`);
                break;
                
                case "orentation":
    
                    mediaQueryStrings.push(`(orentation: ${value})`);
                break;
                
                case "prefersColorScheme":
    
                    mediaQueryStrings.push(`(prefers-color-scheme: ${value})`);
                break;
            };
        } 
   
        const mediaQueryString = "";

        mediaQueryStrings.push(mediaQueryString);
    }

    return mediaQueryStrings.join(" and ").trim();
};


const Abra = () => {
    
    return (
        <View>
            
        </View>
    );
};