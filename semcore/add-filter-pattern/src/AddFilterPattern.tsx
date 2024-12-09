import React from 'react';
import { Flex } from '@semcore/flex-box';
import Button from '@semcore/button';
import createComponent, { Component, Root } from '@semcore/core';
import DropdownMenu from '@semcore/dropdown-menu';
import MathPlusM from '@semcore/icon/MathPlus/m';
import CloseM from '@semcore/icon/Close/m';
import FilterPatternType, {
  AddFilterPatternProps,
  AddFilterPatternItemProps,
} from './AddFilterPattern.types';
import AddFilterPatternSelect from './components/AddFilterPatternSelect';
import AddFilterPatternInput from './components/AddFilterPatternInput';
import AddFilterPatternDropdown from './components/AddFilterPatternDropdown';
import { findAllComponents } from '@semcore/utils/lib/findComponent';
import { localizedMessages } from './translations/__intergalactic-dynamic-locales';
import i18nEnhance from '@semcore/utils/lib/enhances/i18nEnhance';

type AddFilterPatternDropdownOption = { label: string; value: string };
type AddFilterDropdownMenuProps = {
  options: AddFilterPatternDropdownOption[];
  toggleFieldVisibility: (name: string, status?: boolean) => void;
  visibleFilters: Set<string>;
  getI18nText: (key: string) => string;
};

type ClearAllFiltersButtonProps = {
  hasFilterData: boolean;
  clearAll: () => void;
  getI18nText: (key: string) => string;
};

type AddFilterPatternState = {
  visibleFilters: Set<string>;
  addDropdownItems: AddFilterPatternDropdownOption[];
};

const componentsNames = [
  'AddFilterPattern.Item',
  'AddFilterPattern.Input',
  'AddFilterPattern.Select',
  'AddFilterPattern.Dropdown',
];

const enhance = [i18nEnhance(localizedMessages)] as const;
class RootAddFilterPattern extends Component<
  AddFilterPatternProps,
  {},
  AddFilterPatternState,
  typeof enhance
> {
  static displayName = 'AddFilterPattern';
  alwaysVisibleFilters?: React.ReactElement<AddFilterPatternItemProps>[];
  allHidableFilters?: React.ReactElement<AddFilterPatternItemProps>[];

  static enhance = enhance;
  static defaultProps = {
    i18n: localizedMessages,
    locale: 'en',
  };

  static findAllFilters = (children: React.ReactNode) => {
    return findAllComponents(children, componentsNames);
  };

  static filterChildrenByVisibility = (
    filterChildren: React.ReactElement<AddFilterPatternItemProps>[],
    alwaysVisible: boolean,
  ) => {
    return filterChildren.filter(({ props, type }) => {
      return (
        Boolean(props.alwaysVisible) === alwaysVisible ||
        (typeof type !== 'string' &&
          'displayName' in type &&
          type.displayName === 'AddFilterPattern.Item')
      );
    });
  };

  static getDefaultAddDropdownOptions = (children: React.ReactNode) => {
    const allFilters = RootAddFilterPattern.findAllFilters(children);
    const allHidableItems = RootAddFilterPattern.filterChildrenByVisibility(allFilters, false);

    return allHidableItems.map(({ props }: { props: AddFilterPatternItemProps }) => {
      const { name, displayName } = props;
      const value = name;
      const label = displayName ?? name;

      return { label, value };
    });
  };

  constructor(props: AddFilterPatternProps) {
    super(props);

    this.state = {
      visibleFilters: new Set(),
      addDropdownItems: RootAddFilterPattern.getDefaultAddDropdownOptions(props.children),
    };
  }

  getVisibleFromHidableFilters(allFilters: React.ReactElement<AddFilterPatternItemProps>[]) {
    const allHidableFilters = RootAddFilterPattern.filterChildrenByVisibility(allFilters, false);

    return Array.from(this.state.visibleFilters).map((name) => {
      return allHidableFilters.find(({ props }) => props.name === name);
    });
  }

  getSelectProps(props: AddFilterPatternItemProps) {
    const { name, alwaysVisible } = props;
    const { filterData } = this.asProps;

    return {
      value: filterData[name],
      alwaysVisible,
      onClear: () => {
        this.hideFilter(name, alwaysVisible);
      },
    };
  }

  getInputProps(props: AddFilterPatternItemProps) {
    const { name, alwaysVisible } = props;
    const { filterData } = this.asProps;

    return {
      value: filterData[name],
      alwaysVisible,
      onClear: () => {
        this.hideFilter(name, alwaysVisible);
      },
    };
  }

  getDropdownProps(props: AddFilterPatternItemProps) {
    const { name, alwaysVisible } = props;
    const { filterData } = this.asProps;

    return {
      value: filterData[name],
      name,
      onClear: () => {
        this.hideFilter(name, alwaysVisible);
      },
    };
  }

  clearAll() {
    this.setState({
      visibleFilters: new Set(),
    });
    this.props.onClearAll();
  }

  toggleFieldVisibility(name: string, status: boolean) {
    const visibleFilters = new Set(Array.from(this.state.visibleFilters));
    if (status) {
      visibleFilters.add(name);
    } else {
      visibleFilters.delete(name);
    }

    this.setState({ visibleFilters });
  }

  hideFilter(name: string, alwaysVisible?: boolean) {
    if (alwaysVisible) {
      return;
    }
    this.toggleFieldVisibility(name, false);
  }

  getDropdownMenuProps() {
    const { getI18nText } = this.asProps;

    return {
      options: this.state.addDropdownItems,
      toggleFieldVisibility: (name: string, status: boolean) =>
        this.toggleFieldVisibility(name, status),
      visibleFilters: this.state.visibleFilters,
      getI18nText,
    };
  }

  getClearAllFiltersProps() {
    const { getI18nText, filterData } = this.asProps;
    return {
      hasFilterData: Object.values(filterData).filter(Boolean).length > 0,
      clearAll: () => this.clearAll(),
      getI18nText,
    };
  }

  render() {
    const { Children } = this.asProps;
    const allFilters = RootAddFilterPattern.findAllFilters(Children);
    const AlwaysVisibleFilters = RootAddFilterPattern.filterChildrenByVisibility(allFilters, true);
    const VisibleFilteredChildren = this.getVisibleFromHidableFilters(allFilters);

    return (
      <Root render={Flex}>
        {AlwaysVisibleFilters}
        {VisibleFilteredChildren}
        <AddFilterPattern.DropdownMenu />
        <AddFilterPattern.ClearAllFilters />
      </Root>
    );
  }
}

function AddFilterDropdownMenu(props: AddFilterDropdownMenuProps) {
  const { options, toggleFieldVisibility, visibleFilters, getI18nText } = props;
  const [visible, setVisible] = React.useState(false);

  const optionsWithoutVisible = React.useMemo(() => {
    return options.filter((filter) => {
      return !Array.from(visibleFilters).includes(filter.value);
    });
  }, [options, visibleFilters]);

  return (
    Boolean(optionsWithoutVisible.length) && (
      <DropdownMenu visible={visible} onVisibleChange={setVisible}>
        <DropdownMenu.Trigger tag={Button} use='tertiary' addonLeft={MathPlusM}>
          {getI18nText('AddFilterPattern.DropdownTrigger.Text')}
        </DropdownMenu.Trigger>
        <DropdownMenu.Menu>
          {optionsWithoutVisible.map(({ label, value }) => (
            <DropdownMenu.Item
              key={value}
              onClick={() => {
                toggleFieldVisibility(value, true);
                setVisible(false);
              }}
            >
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Menu>
      </DropdownMenu>
    )
  );
}

function ClearAllFilters({ hasFilterData, clearAll, getI18nText }: ClearAllFiltersButtonProps) {
  return (
    hasFilterData && (
      <Button use='tertiary' theme='muted' addonLeft={CloseM} ml='auto' onClick={clearAll}>
        {getI18nText('AddFilterPattern.Button.Text')}
      </Button>
    )
  );
}

function AddFilterPatternItem() {
  return <Root render={Flex} />;
}

const AddFilterPattern: typeof FilterPatternType = createComponent(RootAddFilterPattern, {
  Item: AddFilterPatternItem,
  Select: AddFilterPatternSelect,
  Input: AddFilterPatternInput,
  Dropdown: AddFilterPatternDropdown,
  DropdownMenu: AddFilterDropdownMenu,
  ClearAllFilters,
});

export default AddFilterPattern;
