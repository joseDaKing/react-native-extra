import { useEffect, useState } from "react";



export function useMediaQuery(query: string): boolean {

    const [state, setState] = useState(true);

    const mediaQueryList = matchMedia(query);

    const listener = ({ matches }: any) => setState(matches);

    mediaQueryList.addEventListener("change", listener);

    useEffect(() => {
        
        mediaQueryList.removeEventListener("change", listener);
    }, []);
    
    return state;
};