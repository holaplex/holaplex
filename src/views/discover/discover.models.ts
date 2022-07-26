export interface SelectOption {
  value: any;
  label: string;
}

export interface NestedSelectOption {
  subOptions?: { [key: string | number]: NestedSelectOption & SelectOption };
  defaultSubOptionValue?: any;
}

export interface SelectedOptionLabels {
  [key: string]: string | SelectedOptionLabels | null;
}
