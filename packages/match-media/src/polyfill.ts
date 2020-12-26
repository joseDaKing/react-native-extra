import { MediaQueryList } from "./media-query-list";

function matchMedia(media: string) {

    return new MediaQueryList(media);
};


if (typeof window !== "undefined") {
    
    // @ts-ignore: does not properly extend MediaQueryList
    global.matchMedia = (query: string) => new MediaQueryList(query);
}