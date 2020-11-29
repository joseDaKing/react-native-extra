import { useEffect, useMemo, useState } from "react";


export type UseMediaQuery = (query: string) => boolean;

export const useMediaQueryFactory = (): UseMediaQuery => {

    const [state, setState] = useState(true);

    return query => {

        const mediaQueryList = matchMedia(query);

        const listener = ({ matches }: any) => setState(matches);

        mediaQueryList.addEventListener("change", listener);

        useEffect(() => {
            
            mediaQueryList.removeEventListener("change", listener);
        }, []);
        
        return state;
    };
};

export const useMediaQuery: UseMediaQuery = query => {

    return useMemo((): boolean => {
    
        return useMediaQueryFactory()(query)
    
    }, [ query ]);
};