import { 
    Dimensions,
    AccessibilityInfo,
    Appearance,
} 
from "react-native"; 

import { createAsyncMediaQueryMetadata, createMediaQueryResult } from "./create-media-query-result";



type Listener = (input: MediaQueryList) => any;

export class MediaQueryList {

    matches = true;

    media: string;

    private listeners: Set<Listener> = new Set();

    constructor(media: string) {

        this.media = media;

        this.matches = createMediaQueryResult(media);

        (async () => {
            
            this.matches = createMediaQueryResult(media, await createAsyncMediaQueryMetadata());
            
            await this.excuteListeners();
        })();
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

        AccessibilityInfo.addEventListener("reduceMotionChanged", this.excuteListeners.bind(this));

        AccessibilityInfo.addEventListener("reduceTransparencyChanged", this.excuteListeners.bind(this));

        AccessibilityInfo.addEventListener("invertColorsChanged", this.excuteListeners.bind(this));

        Dimensions.addEventListener("change", this.excuteListeners.bind(this));

        Appearance.addChangeListener(this.excuteListeners.bind(this));
    };

    private removeReactNativeListeners():void {

        AccessibilityInfo.removeEventListener("reduceMotionChanged", this.excuteListeners);

        AccessibilityInfo.removeEventListener("reduceTransparencyChanged", this.excuteListeners);

        AccessibilityInfo.removeEventListener("invertColorsChanged", this.excuteListeners);

        Dimensions.removeEventListener("change", this.excuteListeners);

        Appearance.removeChangeListener(this.excuteListeners);
    }

    private async excuteListeners() {

        this.matches = createMediaQueryResult(this.media, await createAsyncMediaQueryMetadata());

        this.listeners.forEach(listener => listener(this))
    }
}