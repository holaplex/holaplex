export interface Option<T> {
    value: T;
    label: string;
    queryValue: string;
}

export class Options<T> {
    readonly options: Option<T>[];
    private selectedIndex: number | null = null;
    private defaultIndex: number | null = null;

    private constructor(options: Option<T>[], defaultIndex?: number) {
        this.options = options;
        if (defaultIndex) {
            this.defaultIndex = defaultIndex;
            this.selectedIndex = defaultIndex;
        }
    }

    public static of<V>(options: Option<V>[], defaultIndex?: number): Options<V> {
        if ([...new Set(options.map(v => v.value))].length < options.length) {
            throw new Error('Option values must be unique.');
        }
        if (defaultIndex !== undefined) {
            Options.validateIndex(defaultIndex, options);
        }
        return new Options<V>(options, defaultIndex);
    }

    private static validateIndex(index: number, options: any[]): void {
        if (index < 0 || index >= options.length) {
            throw new Error('Index out of bounds of options.');
        }
    }

    public getSelected(): Option<T> | null {
        return this.selectedIndex !== null ? this.options[this.selectedIndex] : null;
    }

    public setSelected(index: number): void {
        Options.validateIndex(index, this.options);
        this.selectedIndex = index;
    }

    public getSelectedIndex(): number | null {
        return this.selectedIndex;
    }

    public getDefaultIndex(): number | null {
        return this.defaultIndex;
    }

    public getLabels(): string[] {
        return this.options.map(v => v.label);
    }
}