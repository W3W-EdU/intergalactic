import React from 'react';
import createComponent, { Component, Root } from '@semcore/core';
import Select from '@semcore/select';
import { AddFilterPatternItemProps } from '../AddFilterPattern.types';
import { FilterTrigger } from '@semcore/base-trigger';

type AsPropsWithOnClear<T> = T & { onClear: () => void };
class AddFilterPatternSelectRoot extends Component<AddFilterPatternItemProps> {
  static displayName = 'AddFilterPatternSelect';
  menuRef = React.createRef<HTMLDivElement>();

  static defaultProps = () => {
    return {
      defaultVisible: true,
    };
  };

  getTriggerProps(props: { onClear: () => void }) {
    const { value, onClear } = this.asProps as AsPropsWithOnClear<typeof this.asProps>;

    return {
      ...props,
      tag: FilterTrigger,
      onBlur: (e: React.FocusEvent<HTMLImageElement>) => {
        if (
          !value &&
          !this.menuRef.current
            ?.closest('[data-ui-name="DropdownMenu.Popper"]')
            ?.contains(e.relatedTarget)
        ) {
          setTimeout(onClear, 100);
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLImageElement>) => {
        if (!value && e.key === 'Escape') {
          onClear();
        }
      },
      empty: !value,
      onClear,
      autoFocus: true,
    };
  }

  getMenuProps() {
    return {
      ref: this.menuRef,
    };
  }

  getListProps() {
    return {
      ref: this.menuRef,
    };
  }

  render() {
    return <Root render={Select} />;
  }
}

const AddFilterPatternSelect = createComponent(AddFilterPatternSelectRoot, {
  Trigger: Select.Trigger,
  Menu: Select.Menu,
  Option: Select.Option,
  List: Select.List,
  Popper: Select.Popper,
});

export default AddFilterPatternSelect;
