import { 
    Platform,
    PixelRatio,
    Dimensions,
    AccessibilityInfo,
    Appearance,
} 
from "react-native";

import synchnorizedPromise from "synchronized-promise";

import mediaQuery from "css-mediaquery";



type MediaQueryMetadata = {
    type: "screen";
    width: number;
    height: number;
    orientation: "portrait" | "landscape";
    "aspect-ratio": number;
    "prefers-reduced-transparency": "no-preference" | "reduce";
    "prefers-color-scheme-value": "light" | "dark";
    "prefers-reduced-motion": "no-preference" | "reduce";
    "inverted-colors": "none" | "inverted";
    "platform": typeof Platform.OS;
    resolution: number;
};

type EventListenerMethods = "addEventListener" | "removeEventListener" | "addListener" | "removeListener";

type MediaQueryListListenerEvent = Omit<MediaQueryList, EventListenerMethods>;

type MediaQueryListListener = (mediaQueryListListenerEvent: MediaQueryListListenerEvent) => any | void;

const isReduceTransparencyEnabledSync = synchnorizedPromise(AccessibilityInfo.isReduceTransparencyEnabled);

const isReduceMotionEnabledSync = synchnorizedPromise(AccessibilityInfo.isReduceMotionEnabled);

const isInvertColorsEnabledSync = synchnorizedPromise(AccessibilityInfo.isInvertColorsEnabled);

export class MediaQueryList {
    
    private mediaQueryListListeners: MediaQueryListListener[] = [];

    private media: string;
    
    public matches: boolean = true;

    constructor(media: string) {

        this.media = media;

        this.setMediaQueryResult();

        Dimensions.addEventListener("change", this.excuteListeners);

        AccessibilityInfo.addEventListener("reduceTransparencyChanged", this.excuteListeners);

        AccessibilityInfo.addEventListener("invertColorsChanged", this.excuteListeners);

        AccessibilityInfo.addEventListener("reduceMotionChanged", this.excuteListeners);

        Appearance.addChangeListener(this.excuteListeners);
    };

    onchange?: MediaQueryListListener;

    addEventListener(type: "change", listener: MediaQueryListListener): void {
    
        if (type === "change") {

            this.mediaQueryListListeners.push(listener);
        }
    };
    
    removeEventListener(type: "change", listener: MediaQueryListListener): void {

        if (type === "change") {

            const index = this.mediaQueryListListeners.indexOf(listener);
            
            if (index !== -1) this.mediaQueryListListeners.splice(index, 1);
        }
    };

    addListener(listener: MediaQueryListListener): void {
    
        this.addEventListener("change", listener);
    };
    
    removeListener(listener: MediaQueryListListener): void {

        this.removeEventListener("change", listener);
    };

    private excuteListeners(): void {

        this.setMediaQueryResult();

        this.onchange && this.onchange(this);
        
        this.mediaQueryListListeners.forEach(mediaQueryListListener => mediaQueryListListener(this));
    };

    private setMediaQueryResult(): void {

        this.matches = mediaQuery.match(this.media, this.getMediaQueryMetadata());
    };

    private getMediaQueryMetadata(): MediaQueryMetadata {
        
        const windowDimensions = Dimensions.get("window");

        const orientation = windowDimensions.width < windowDimensions.height ? "portrait" : "landscape";

        const aspectRatio = windowDimensions.width / windowDimensions.height;

        const prefersReducedTransparency = isReduceTransparencyEnabledSync() ? "reduce" : "no-preference";

        const prefersColorScheme = Appearance.getColorScheme() ?? "light";

        const prefersReducedMotion = isReduceMotionEnabledSync() ? "reduce" : "no-preference";

        const invertedColors = isInvertColorsEnabledSync() ? "inverted" : "none";

        const resolution = PixelRatio.get() * 160;

        return {
            type: "screen",
            width: windowDimensions.width,
            height: windowDimensions.height,
            "aspect-ratio": aspectRatio,
            "prefers-reduced-transparency": prefersReducedTransparency,
            "prefers-color-scheme-value": prefersColorScheme,
            "prefers-reduced-motion": prefersReducedMotion,
            "inverted-colors": invertedColors,
            platform: Platform.OS,
            orientation,
            resolution,
        };
    };
};