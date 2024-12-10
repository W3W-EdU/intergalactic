import React from 'react';
import createComponent, { Component, Root } from '@semcore/core';
import Dropdown from '@semcore/dropdown';
import { AddFilterPatternItemProps } from '../AddFilterPattern.types';
import { FilterTrigger } from '@semcore/base-trigger';

type AsPropsTypeWithHandlers<T> = T & {
  onChange: (v: any) => void;
  onClear: () => void;
};

class AddFilterPatternDropdownRoot extends Component<AddFilterPatternItemProps> {
  static displayName = 'AddFilterPatternDropdown';
  popperRef = React.createRef<HTMLDivElement>();

  static defaultProps = () => {
    return {
      defaultVisible: true,
    };
  };

  getTriggerProps() {
    const { value, onClear } = this.asProps as AsPropsTypeWithHandlers<typeof this.asProps>;

    return {
      tag: FilterTrigger,
      empty: !value,
      onClear,
      autoFocus: true,
    };
  }

  getPopperProps() {
    const { value, onClear } = this.asProps as AsPropsTypeWithHandlers<typeof this.asProps>;

    return {
      ref: this.popperRef,
      onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
        if (!value && !this.popperRef.current?.contains(e.relatedTarget)) {
          setTimeout(onClear, 100);
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!value && e.key === 'Escape') {
          onClear();
        }
      },
    };
  }

  render() {
    return <Root render={Dropdown} />;
  }
}

const AddFilterPatternDropdown = createComponent(AddFilterPatternDropdownRoot, {
  Trigger: Dropdown.Trigger,
  Popper: Dropdown.Popper,
});

export default AddFilterPatternDropdown;
