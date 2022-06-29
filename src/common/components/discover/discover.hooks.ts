import { useMemo, useReducer } from "react";
import { SelectOptions, SelectOptionsSpec } from "./discover.models";

export function useSelectOptions(spec: SelectOptionsSpec[], defaultValue?: any) {
    const options: SelectOptions = useMemo(() => SelectOptions.from(spec, defaultValue), []);
    
    // hack to trigger re-render when a new selection is made
    const [_, update] = useReducer(x => x + 1, 0);

    function setNthSelectedByIndex(index: number, level: number = 0) {
        options.setNthSelectedByIndex(index, level);
        update();
    }

    return {
        setNthSelectedByIndex,
        getNthLabels: (level: number): string[] => options.getNthLabels(level),
        nthLevelHasOptions: (level: number): boolean => options.nthLevelHasOptions(level),
        getNthDefaultValue: (level: number): any | undefined => options.getNthDefaultValue(level),
        getNthSelectedIndex: (level: number): number | undefined => options.getNthSelectedIndex(level),
    }
}