import { 
    Platform,
    PixelRatio,
    Dimensions,
    AccessibilityInfo,
    Appearance,
} 
from "react-native";

import cssMediaQuery from "css-mediaquery";



export function createMediaQueryResult(mediaQuery: string, asyncMediaQueryMetadata?: AsyncMediaQueryMetadata): boolean {

    const mediaQueryResult = cssMediaQuery.match(mediaQuery, {
        ...createMediaQueryMetadata(),
        ...(asyncMediaQueryMetadata ?? {})
    });

    return mediaQueryResult;
};



type PrefersReducedValue = "reduce" | "no-preference";

type InvertedColorsValue = "inverted" | "none";

type PrefersColorSchemeValue = "light" | "dark";

type OrientationValue = "landscape" | "portrait";

type MediaQueryMetadata = {
    type: "all",
    "prefers-color-scheme": PrefersColorSchemeValue;
    width: number;
    height: number;
    "aspect-ratio": number;
    orientation: OrientationValue;
    resolution: number;
}

function createMediaQueryMetadata(): MediaQueryMetadata {

    const prefersColorScheme = getPrefersColorScheme();

    const width = getWidth();

    const height = getHeight();

    const aspectRatio = getAspectRatio();

    const orientation = getOrientation();

    const resolution = getResolution();

    return {
        type: "all",
        "prefers-color-scheme": prefersColorScheme,
        width,
        height,
        "aspect-ratio": aspectRatio,
        orientation,
        resolution
    };
};



type AsyncMediaQueryMetadata = {
    "prefers-reduced-transparency": PrefersReducedValue;
    "prefers-reduced-motion": PrefersReducedValue;
    "inverted-colors": InvertedColorsValue;
}

export async function createAsyncMediaQueryMetadata(): Promise<AsyncMediaQueryMetadata> {

    const [
        prefersReducedTransparency,
        prefersReducedMotion,
        invertedColors
    ] = await Promise.all([
        getPrefersReducedTransparency(),
        getPrefersReducedMotion(),
        getInvertedColors()
    ]);

    return {
        "prefers-reduced-motion": prefersReducedMotion,
        "prefers-reduced-transparency": prefersReducedTransparency,
        "inverted-colors": invertedColors
    };
};

async function getPrefersReducedTransparency(): Promise<PrefersReducedValue> {

    const prefersReducedTransparency = (await AccessibilityInfo.isReduceTransparencyEnabled()) ? "reduce" : "no-preference";

    return prefersReducedTransparency;
};

async function getPrefersReducedMotion(): Promise<PrefersReducedValue> {

    const prefersReducedMotion = (await AccessibilityInfo.isReduceMotionEnabled()) ? "reduce" : "no-preference";

    return prefersReducedMotion;
};

async function getInvertedColors(): Promise<InvertedColorsValue> {

    const invertedColors = (await AccessibilityInfo.isInvertColorsEnabled()) ? "inverted" : "none";

    return invertedColors;
};



function getPrefersColorScheme(): PrefersColorSchemeValue {

    const prefersColorScheme = Appearance.getColorScheme() ?? "light";

    return prefersColorScheme;
};

function getWidth(): number {

    return Dimensions.get("window").width;
};

function getHeight(): number {

    return Dimensions.get("window").height;
};

function getAspectRatio(): number {

    const { height, width } = Dimensions.get("window");

    return height / width;
};

function getOrientation(): OrientationValue {

    const { height, width } = Dimensions.get("window");

    if (width < height) {
        
        return "portrait";
    }

    return "landscape";
};

function getResolution(): number {

    const resolution = PixelRatio.get() * 160;

    return resolution;
};