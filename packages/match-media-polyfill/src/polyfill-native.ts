import { MediaQueryList } from "./media-query-list";

const matchMedia = (query: string) => new MediaQueryList(query);

if (typeof window !== "undefined") {

    // @ts-ignore
    global.matchMedia = matchMedia;
}