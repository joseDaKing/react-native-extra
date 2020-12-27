import { 
    Dimensions,
    AccessibilityInfo,
    Appearance,
} 
from "react-native"; 

import { createAsyncMediaQueryMetadata, createMediaQueryResult } from "./create-media-query-result";
import { HasMediaFeature } from "./has-media-feature";



type Listener = (input: MediaQueryList) => any;



export class MediaQueryList {

    matches = true;

    media: string;

    private listeners: Set<Listener> = new Set();

    private hasMediaFeature: HasMediaFeature;

    private excuteListeners = async () => {

        this.matches = createMediaQueryResult(this.media, await createAsyncMediaQueryMetadata());

        this.listeners.forEach(listener => listener(this))
    }

    constructor(media: string) {

        this.media = media;

        this.hasMediaFeature = new HasMediaFeature(media);

        this.matches = createMediaQueryResult(media);

        const onHasAsyncFeature = () => this.excuteListeners();

        this.hasMediaFeature.onHasMediaFeature({
            "inverted-colors": onHasAsyncFeature,
            "prefers-reduced-motion": onHasAsyncFeature,
            "prefers-reduced-transparency": onHasAsyncFeature
        });
    }

    addEventListener(type: "change", listener: Listener) {   

        if (type === "change") {

            if (this.listeners.size === 0) {

                this.addReactNativeListeners();
            }

            this.listeners.add(listener);
        }
    }

    removeEventListener(type: "change", listener: Listener) {

        if (type === "change") {

            this.listeners.delete(listener);

            if (this.listeners.size === 0) {

                this.removeReactNativeListeners();
            }
        }
    }

    private addReactNativeListeners(): void {

        const onHasPreferColorSchemeFeature = () => Appearance.addChangeListener(this.excuteListeners);

        const onHasPrefersReducedTransparencyFeature = () => AccessibilityInfo.addEventListener("reduceTransparencyChanged", this.excuteListeners);

        const onHasPrefersReducedMotionFeature = () => AccessibilityInfo.addEventListener("reduceMotionChanged", this.excuteListeners);

        const onHasInvertedColorsFeature = () => AccessibilityInfo.addEventListener("invertColorsChanged", this.excuteListeners);;

        const onHasDimensionFeature = () => Dimensions.addEventListener("change", this.excuteListeners);

        this.hasMediaFeature.onHasMediaFeature({
            "prefers-color-scheme": onHasPreferColorSchemeFeature,
            "prefers-reduced-transparency": onHasPrefersReducedTransparencyFeature,
            "prefers-reduced-motion": onHasPrefersReducedMotionFeature,
            "inverted-colors": onHasInvertedColorsFeature,
            "aspect-ratio": onHasDimensionFeature,
            height: onHasDimensionFeature,
            width: onHasDimensionFeature,
            orientation: onHasDimensionFeature,
        });
    };

    private removeReactNativeListeners():void {

        const onHasPreferColorSchemeFeature = () => Appearance.removeChangeListener(this.excuteListeners);

        const onHasPrefersReducedTransparencyFeature = () => AccessibilityInfo.removeEventListener("reduceTransparencyChanged", this.excuteListeners);

        const onHasPrefersReducedMotionFeature = () => AccessibilityInfo.removeEventListener("reduceMotionChanged", this.excuteListeners);

        const onHasInvertedColorsFeature = () => AccessibilityInfo.removeEventListener("invertColorsChanged", this.excuteListeners);;

        const onHasDimensionFeature = () => Dimensions.removeEventListener("change", this.excuteListeners);

        this.hasMediaFeature.onHasMediaFeature({
            "prefers-color-scheme": onHasPreferColorSchemeFeature,
            "prefers-reduced-transparency": onHasPrefersReducedTransparencyFeature,
            "prefers-reduced-motion": onHasPrefersReducedMotionFeature,
            "inverted-colors": onHasInvertedColorsFeature,
            "aspect-ratio": onHasDimensionFeature,
            height: onHasDimensionFeature,
            width: onHasDimensionFeature,
            orientation: onHasDimensionFeature,
        });
    }
}