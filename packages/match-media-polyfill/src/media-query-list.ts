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

type ListenerEvent = Omit<MediaQueryList, EventListenerMethods>;

type Listener = (ListenerEvent: ListenerEvent) => any | void;

const isReduceTransparencyEnabledSync = synchnorizedPromise(AccessibilityInfo.isReduceTransparencyEnabled);

const isReduceMotionEnabledSync = synchnorizedPromise(AccessibilityInfo.isReduceMotionEnabled);

const isInvertColorsEnabledSync = synchnorizedPromise(AccessibilityInfo.isInvertColorsEnabled);

export class MediaQueryList {
    
    private listeners: Listener[] = [];

    private media: string;
    
    public matches: boolean = true;

    onchange?: Listener;


    
    constructor(media: string) {

        this.media = media;

        this.setMediaQueryResult();
    };



    addEventListener(type: "change", listener: Listener): void {
    
        if (this.getTotalAmountOfListeners() === 0) {

            this.mount();
        }

        if (type === "change") {

            this.listeners.push(listener);
        }
    };

    private mount(): void {

        Dimensions.addEventListener("change", this.excuteListeners);

        AccessibilityInfo.addEventListener("reduceTransparencyChanged", this.excuteListeners);

        AccessibilityInfo.addEventListener("invertColorsChanged", this.excuteListeners);

        AccessibilityInfo.addEventListener("reduceMotionChanged", this.excuteListeners);

        Appearance.addChangeListener(this.excuteListeners);
    };


    
    removeEventListener(type: "change", listenerToFind: Listener): void {

        if (type === "change" && this.listeners.length !== 0) {

            const index = this.listeners.findIndex(listener => listener === listenerToFind);
        
            if (index !== -1) {

                this.listeners.splice(index, 1);
            }

            if (this.getTotalAmountOfListeners() === 0) {
            
                this.unmount();
            }
        }
    };

    private unmount(): void {

        Dimensions.removeEventListener("change", this.excuteListeners);

        AccessibilityInfo.removeEventListener("reduceTransparencyChanged", this.excuteListeners);

        AccessibilityInfo.removeEventListener("invertColorsChanged", this.excuteListeners);

        AccessibilityInfo.removeEventListener("reduceMotionChanged", this.excuteListeners);

        Appearance.removeChangeListener(this.excuteListeners);
    };

    private getTotalAmountOfListeners(): number {

        return this.listeners.length + (this.onchange ? 1 : 0);
    };



    addListener(listener: Listener): void {
    
        this.addEventListener("change", listener);
    };
    
    removeListener(listener: Listener): void {

        this.removeEventListener("change", listener);
    };

    

    private excuteListeners(): void {

        this.setMediaQueryResult();

        this.onchange && this.onchange(this);
        
        this.listeners.forEach(Listener => Listener(this));
    };

    private setMediaQueryResult(): void {

        try {
            
            this.matches = mediaQuery.match(this.media, this.getMediaQueryMetadata())
        }
        catch {
            
            this.matches = false;
        };
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