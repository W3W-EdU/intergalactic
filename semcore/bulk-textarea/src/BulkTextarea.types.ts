import { Intergalactic } from '@semcore/utils/lib/core';
import { BoxProps } from '@semcore/flex-box';
import Button from '@semcore/button';
import { InputFieldProps } from './components/InputField/InputField';
import { CounterProps } from './components/Counter';
import { ErrorsNavigationProps } from './components/ErrorsNavigation';

export type BulkTextareaProps = {
  value?: InputFieldProps['value'];
  onBlur?: InputFieldProps['onBlur'];
  size?: InputFieldProps['size'];
  state?: InputFieldProps['state'];

  minRows?: InputFieldProps['minRows'];
  maxRows?: InputFieldProps['maxRows'];

  validateOn?: InputFieldProps['validateOn'];
  rowValidation?: InputFieldProps['rowValidation'];
  rowsDelimiters?: InputFieldProps['rowsDelimiters'];
  pasteProps?: InputFieldProps['pasteProps'];

  /**
   * Count of max rows in badge
   * @default 100
   */
  ofRows?: number;
};

export type BulkTextareaType = Intergalactic.Component<'div', BoxProps & BulkTextareaProps> & {
  InputField: Intergalactic.Component<'div', Partial<InputFieldProps>>;
  Counter: Intergalactic.Component<'div', Partial<CounterProps>>;
  ClearAllButton: typeof Button;
  ErrorsNavigation: Intergalactic.Component<'div', Partial<ErrorsNavigationProps>>;
};
