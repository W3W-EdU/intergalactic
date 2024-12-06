import React from 'react';
import createComponent, { Component, sstyled, Root } from '@semcore/core';
import { Box, Flex } from '@semcore/flex-box';
import { Collapse as CollapseAnimate } from '@semcore/animation';
import { Text } from '@semcore/typography';
import ChevronRightM from '@semcore/icon/ChevronRight/m';
import ChevronRightL from '@semcore/icon/ChevronRight/l';
import keyboardFocusEnhance from '@semcore/utils/lib/enhances/keyboardFocusEnhance';
import uniqueIDEnhancement from '@semcore/utils/lib/uniqueID';
import { cssVariableEnhance } from '@semcore/utils/lib/useCssVariable';

import style from './style/accordion.shadow.css';

class RootAccordion extends Component {
  static displayName = 'Accordion';
  static style = style;
  static defaultProps = {
    defaultValue: [],
    use: 'secondary',
  };
  static enhance = [
    cssVariableEnhance({
      variable: '--intergalactic-duration-accordion',
      fallback: '200',
      map: Number.parseInt,
      prop: 'duration',
    }),
  ];

  uncontrolledProps() {
    return {
      value: null,
    };
  }

  handleToggleInteraction = (newValue) => {
    const { value } = this.asProps;

    if (Array.isArray(value)) {
      const indexOfNewValue = value.indexOf(newValue);
      const result = [...value];
      indexOfNewValue === -1 ? result.push(newValue) : result.splice(indexOfNewValue, 1);
      this.handlers.value(result);
    } else {
      this.handlers.value(value === newValue ? null : newValue);
    }
  };

  getItemProps({ value }) {
    const { value: selectedValue, duration, use } = this.asProps;
    const selected = Array.isArray(selectedValue)
      ? selectedValue.includes(value)
      : selectedValue === value;
    return {
      selected,
      duration,
      use,
      $handleInteraction: this.handleToggleInteraction,
    };
  }

  render() {
    const { Children } = this.asProps;
    return <Children />;
  }
}

export class RootItem extends Component {
  static displayName = 'Item';
  static style = style;
  static enhance = [uniqueIDEnhancement()];

  handleClick = () => {
    const { value, $handleInteraction } = this.asProps;

    $handleInteraction(value);
  };

  getToggleProps() {
    const { value, uid, selected, disabled, use } = this.asProps;
    return {
      use,
      disabled,
      onClick: disabled ? undefined : this.handleClick,
      id: `igc-${uid}-${value}-toggle`,
      tag: 'h3',
      size: 300,
    };
  }

  getToggleButtonProps() {
    const { value, uid, selected, disabled } = this.asProps;
    return {
      disabled,
      id: `igc-${uid}-${value}-toggle-button`,
      'aria-expanded': selected ? 'true' : 'false',
      'aria-controls': selected ? `igc-${uid}-${value}-collapse` : undefined,
    };
  }

  getCollapseProps() {
    const { selected, uid, duration, value } = this.asProps;
    return {
      selected,
      duration,
      id: `igc-${uid}-${value}-collapse`,
      role: 'region',
      'aria-labelledby': `igc-${uid}-${value}-toggle-button`,
    };
  }

  getChevronProps() {
    const { selected, size } = this.asProps;
    return {
      selected,
      size,
    };
  }

  render() {
    const { Children } = this.asProps;
    return <Children />;
  }
}

class Toggle extends Component {
  static enhance = [keyboardFocusEnhance()];

  toggleRef = React.createRef();

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (this.toggleRef.current === event.target) {
        event.currentTarget.click();
      }
    } else if (event.key === ' ') {
      event.preventDefault();
      if (this.toggleRef.current === event.target) {
        event.currentTarget.click();
      }
    }
  };

  render() {
    const { styles, disabled, use } = this.asProps;
    const SItemToggle = Root;

    return sstyled(styles)(
      <SItemToggle use={use} ref={this.toggleRef} render={Text} onKeyDown={this.handleKeyDown} />,
    );
  }
}

function Chevron(props) {
  const { styles, size } = props;

  const SItemChevron = Root;
  return sstyled(styles)(<SItemChevron render={size === 'l' ? ChevronRightL : ChevronRightM} />);
}

function ToggleButton(props) {
  const { styles } = props;

  const SToggleButton = Root;
  return sstyled(styles)(
    <SToggleButton alignItems='center' render={Flex} role={'button'} {...props} />,
  );
}

function Collapse(props) {
  const { selected } = props;
  return <Root render={CollapseAnimate} visible={selected} interactive />;
}

const Item = createComponent(RootItem, {
  Toggle,
  Chevron,
  ToggleButton,
  Collapse,
});

const Accordion = createComponent(RootAccordion, {
  Item,
});

export const wrapAccordion = (wrapper) => wrapper;

export default Accordion;
