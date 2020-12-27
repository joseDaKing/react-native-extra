type MediaFeatures = (
    "width"
    | "height"
    | "orientation"
    | "aspect-ratio"
    | "prefers-color-scheme"
    | "prefers-reduced-transparency"
    | "prefers-reduced-motion"
    | "inverted-colors"
);

type HasMediaFeatures = {
    [Key in MediaFeatures]: boolean;
}

type OnMediaFeatureCallbacks = {
    [Key in MediaFeatures]?: () => any
}

export class HasMediaFeature {
    
    private readonly hasMediaFeature: HasMediaFeatures = {
        width: false,
        height: false,
        orientation: false,
        "aspect-ratio": false,
        "prefers-color-scheme": false,
        "prefers-reduced-transparency": false,
        "prefers-reduced-motion": false,
        "inverted-colors": false,
    }

    constructor(media: string) {

        this.setHasMediaFeature(media);
    }

    private setHasMediaFeature(media: string) {

        for (const key in this.hasMediaFeature) {

            const mediaFeature = key as MediaFeatures;

            this.hasMediaFeature[mediaFeature] = media.includes(mediaFeature);
        }
    }

    onHasMediaFeature(onMediaFeatureCallbacks: OnMediaFeatureCallbacks): void {

        for (const key in this.hasMediaFeature) {

            const mediaFeature = key as MediaFeatures;

            const hasFeature = this.hasMediaFeature[mediaFeature]
            
            if (hasFeature) {

                const onFeatureCallback = onMediaFeatureCallbacks[mediaFeature];

                if (onFeatureCallback) {

                    onFeatureCallback();
                }
            }
        }
    }
}