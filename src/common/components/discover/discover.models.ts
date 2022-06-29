import { SortOptions } from '../home/home.interfaces';

export interface SelectOption {
  value: any;
  label: string;
  queryValue: string;
}

export interface SelectOptionsSpec extends SelectOption {
  subOptions?: SelectOption[];
  defaultSubOptionValue?: any;
}

export interface SelectedOptionLabels {
  [key: string]: string | SelectedOptionLabels | null;
}

export class SelectOptions implements SelectOption {
  value: any;
  label: string;
  queryValue: string;

  private readonly options: Map<any, SelectOption | SelectOptions>;
  private readonly order: any[];
  private selectedValue: any | undefined;
  private defaultValue: any | undefined;

  private constructor(
    options: Map<any, SelectOption | SelectOptions>,
    order: any[],
    defaultValue?: any,
    value?: any | undefined,
    label: string = '',
    queryValue: string = ''
  ) {
    this.options = options;
    this.order = order;
    if (defaultValue !== undefined) {
      this.validateValue(defaultValue);
      this.defaultValue = defaultValue;
      this.selectedValue = defaultValue;
    }
    this.value = value;
    this.label = label;
    this.queryValue = queryValue;
  }

  public static from(options: SelectOptionsSpec[], defaultValue?: any): SelectOptions {
    const optionMap: Map<any, SelectOption | SelectOptions> = new Map<any, SelectOption>();
    for (const option of options) {
      if (optionMap.has(option.value)) {
        throw new Error('Option values must be unique.');
      }

      let optionMapValue: SelectOption | SelectOptions;
      if (option.subOptions !== undefined) {
        optionMapValue = SelectOptions.from(option.subOptions, option.defaultSubOptionValue);
        optionMapValue.label = option.label;
        optionMapValue.value = option.value;
        optionMapValue.queryValue = option.queryValue;
      } else {
        optionMapValue = option;
      }
      optionMap.set(option.value, optionMapValue);
    }
    const order: any[] = options.map((v) => v.value);
    return new SelectOptions(optionMap, order, defaultValue);
  }

  private validateValue(value: any): void {
    if (!this.options.has(value)) {
      throw new Error(`${value} is not a valid option value`);
    }
  }

  public getSelected(): SelectOption[] {
    const result: SelectOption[] = [];
    if (this.selectedValue !== undefined) {
      const selected: SelectOption | SelectOptions = this.options.get(this.selectedValue)!;
      result.push(selected);
      if (selected instanceof SelectOptions) {
        const subSelection: SelectOption[] | undefined = selected.getSelected();
        if (subSelection !== undefined) result.push(...subSelection);
      }
    }
    return result;
  }

  public setSelected(...values: any[]): void {
    if (values.length === 0) throw new Error('Must provide at least one value.');
    else if (values.length > 1) this.setSelected(values.slice(1));
    else this.setNthSelected(values[0]);
  }

  public getNthSelected(level: number = 0): SelectOption | undefined {
    const selection: SelectOption[] | undefined = this.getSelected();
    return selection && selection[level];
  }

  public setNthSelected(value: any, level: number = 0): void {
    if (level < 0) {
      throw new Error('Level must be a non-negative integer.');
    } else if (level === 0) {
      this.validateValue(value);
      this.selectedValue = value;
    } else if (this.selectedValue === undefined) {
      throw new Error('Tried to set a nested option before its parent.');
    } else {
      const option: SelectOption | SelectOptions = this.options.get(this.selectedValue)!;
      if (option instanceof SelectOptions) {
        option.setNthSelected(value, level - 1);
      } else {
        throw new Error('Tried to set a nested option on an option without children.');
      }
    }
  }

  public setSelectedByIndex(...indices: number[]): void {
    if (indices.length === 0) throw new Error('Must supply at least one index.');
    this.setNthSelectedByIndex(indices[0], 0);
    if (indices.length > 1) this.setSelectedByIndex(...indices.slice(1));
  }

  public setNthSelectedByIndex(index: number, level: number = 0): void {
    if (level < 0) {
      throw new Error('Level must be a non-negative integer.');
    } else if (level === 0) {
      if (index < 0 || index >= this.order.length) {
        throw new Error(`Index ${index} out of bounds (0 - ${this.order.length - 1})`);
      }
      this.setNthSelected(this.order[index], 0);
    } else if (this.selectedValue === undefined) {
      throw new Error('Tried to set a nested option before its parent.');
    } else {
      const option: SelectOption | SelectOptions = this.options.get(this.selectedValue)!;
      if (option instanceof SelectOptions) {
        option.setNthSelectedByIndex(index, level - 1);
      } else {
        throw new Error('Tried to set a nested option on an option without children.');
      }
    }
  }

  public getSelectedValues(): any[] | undefined {
    const selections: SelectOption[] | undefined = this.getSelected();
    return selections && selections.map((v) => v.value);
  }

  public getNthSelectedValue(level: number = 0): any | undefined {
    const selection: SelectOption | undefined = this.getNthSelected(level);
    return selection && selection.value;
  }

  public getSelectedIndices(): number[] | undefined {
    const selections: SelectOption[] | undefined = this.getSelected();
    return selections && selections.map((v) => v.value);
  }

  public getNthSelectedIndex(level: number): number | undefined {
    const selection: SelectOption | undefined = this.getNthSelected(level);
    return selection && this.order.indexOf(selection.value);
  }

  public getNthDefaultValue(level: number = 0): any | undefined {
    return this.getNthOptions(level).defaultValue;
  }

  public getLabels(): SelectedOptionLabels {
    const result: SelectedOptionLabels = {};
    for (const value of this.order) {
      const option: SelectOption | SelectOptions = this.options.get(value)!;
      if (option instanceof SelectOptions) {
        result[option.label] = option.getLabels();
      } else {
        result[option.label] = null;
      }
    }
    return result;
  }

  public getNthLabels(level: number = 0): string[] {
    return this.getNthOptions(level).getThisLabels();
  }

  private getThisLabels(): string[] {
    return this.order.map((o) => this.options.get(o)!.label);
  }

  private getNthOptions(level: number): SelectOptions {
    if (level < 0) throw new Error('Level must be non-negative');
    else if (level === 0) return this;
    else if (this.selectedValue === undefined) {
      throw new Error('Tried to get nested option before selecting a parent option.');
    } else {
      const option: SelectOption | SelectOptions = this.options.get(this.selectedValue)!;
      if (option instanceof SelectOptions) {
        return option.getNthOptions(level - 1);
      } else {
        throw new Error('Tried to get a nested option on an option without children.');
      }
    }
  }

  public nthLevelHasOptions(level: number): boolean {
    if (level < 0) throw new Error('Level must be non-negative.');
    else if (level == 0) return true;
    else if (this.selectedValue === undefined) return false;
    else {
      const option: SelectOption | SelectOptions = this.options.get(this.selectedValue)!;
      if (option instanceof SelectOptions) return option.nthLevelHasOptions(level - 1);
      else return false;
    }
  }
}
