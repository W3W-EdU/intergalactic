import React from 'react';
import createComponent, {
  Component,
  sstyled,
  Root,
  PropGetterFn,
  UnknownProperties,
  Intergalactic,
  IRootComponentProps,
} from '@semcore/core';
import Input, { InputProps, InputValueProps } from '@semcore/input';
import ScrollArea, { ScrollAreaProps } from '@semcore/scroll-area';
import Tag, { TagProps, TagContainer, TagTextProps, TagContext } from '@semcore/tag';
import fire from '@semcore/utils/lib/fire';
import { ScreenReaderOnly } from '@semcore/flex-box';
import uniqueIDEnhancement from '@semcore/utils/lib/uniqueID';
import Portal from '@semcore/portal';
import { localizedMessages } from './translations/__intergalactic-dynamic-locales';
import i18nEnhance from '@semcore/utils/lib/enhances/i18nEnhance';

import style from './style/input-tag.shadow.css';
import { extractFrom, isAdvanceMode } from '@semcore/utils/lib/findComponent';
import { getAccessibleName } from '@semcore/utils/lib/getAccessibleName';

/** @deprecated */
export interface IInputTagsValueProps extends InputTagsValueProps, UnknownProperties {}
export type InputTagsValueProps = InputValueProps & {};

export type InputTagsSize = 'l' | 'm';

/** @deprecated */
export interface IInputTagsProps extends InputTagsProps, UnknownProperties {}
export type InputTagsProps = Omit<InputProps, 'size'> &
  ScrollAreaProps & {
    /**
     * Component size
     * @default m
     */
    size?: InputTagsSize;
    /**
     * Event is called when tag needs to be added
     * @deprecated use `onAppend` instead
     */
    onAdd?: (value: string, event: React.KeyboardEvent | React.ClipboardEvent) => void;
    /** Event is called when tags need to be added */
    onAppend?: (values: string[], event: React.KeyboardEvent | React.ClipboardEvent) => void;
    /** Event is called when tags need to be removed  */
    onRemove?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    /** List delimiter of tags. Don't forget to add 'Enter' and 'Tab' to hande corresponding hotkeys.
     * @default [',', ';', '|', 'Enter', 'Tab']
     * */
    delimiters?: string[];
    locale?: string;
  };

/** @deprecated */
export interface IInputTagsTagProps extends InputTagsTagProps, UnknownProperties {}
export type InputTagsTagProps = TagProps & {
  /** Property enabling the ability to remove a tag on click */
  editable?: boolean;
};

/** @deprecated */
export interface IInputTagsContext extends InputTagsContext, UnknownProperties {}
export type InputTagsContext = InputTagsProps & {
  getValueProps: PropGetterFn;
  getTagProps: PropGetterFn;
};

type State = {
  tagsContainerAriaLabel: string;
  srMessage: string;
};

class InputTags extends Component<IInputTagsProps, {}, State, typeof InputTags.enhance> {
  static displayName = 'InputTags';
  static style = style;
  static enhance = [uniqueIDEnhancement(), i18nEnhance(localizedMessages)] as const;
  static defaultProps = {
    size: 'm',
    delimiters: [',', ';', '|', 'Enter', 'Tab'],
    defaultValue: '',
    i18n: localizedMessages,
    locale: 'en',
  };

  inputRef = React.createRef<HTMLInputElement>();
  scrollContainerRef = React.createRef<HTMLElement>();
  tagsRefs: (HTMLElement | null)[] = [];
  srMessageTimeout = 0;

  state = {
    tagsContainerAriaLabel: '',
    srMessage: '',
  };

  componentDidMount() {
    const inputElement = this.inputRef.current;
    const inputAccessibleName = getAccessibleName(inputElement);

    this.setState({
      tagsContainerAriaLabel: inputAccessibleName,
    });
  }

  componentWillUnmount() {
    if (this.srMessageTimeout) {
      clearTimeout(this.srMessageTimeout);
    }
  }

  moveFocusToInput = (event: React.FocusEvent) => {
    const inputRef = this.inputRef.current;
    if (inputRef && event.target !== inputRef) {
      const caretPosition = inputRef.value.length;
      event.preventDefault();
      inputRef.focus();
      inputRef.setSelectionRange(caretPosition, caretPosition);
    }
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, currentTarget } = event;
    const { delimiters, getI18nText } = this.asProps;
    const { value } = currentTarget;
    const lastSymbol = value.slice(-1);
    const trimmedValue = value.trim();

    if ((delimiters?.includes(key) || (lastSymbol === ' ' && key === ' ')) && trimmedValue) {
      event.preventDefault();
      fire(this, 'onAdd', trimmedValue, event);
      fire(this, 'onAppend', [trimmedValue], event);

      this.setTagActionMessage(
        getI18nText('InputTags.addedNewTag:sr-message', { tagValue: trimmedValue }),
      );

      if (typeof this.inputRef.current?.scrollIntoView === 'function') {
        setTimeout(() => {
          if (typeof this.inputRef.current?.scrollIntoView === 'function') {
            this.inputRef.current.scrollIntoView({
              block: 'nearest',
              inline: 'nearest',
              behavior: 'smooth',
            });
          }
        }, 0);
      }
    }

    if (key === 'Backspace' && !value) {
      event.preventDefault();
      fire(this, 'onRemove', event);
    }
  };

  handlePaste = (event: React.ClipboardEvent) => {
    const value = event.clipboardData.getData('text/plain');
    const { delimiters, onAdd, onAppend } = this.asProps;
    const reg = new RegExp(
      delimiters!
        .filter((s) => !/\w+/.test(String(s)))
        .map((s) => s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('|'),
    );
    const tagsToBeAdded = value.split(reg).filter(Boolean);
    if (tagsToBeAdded.length > 0) {
      event.preventDefault();
      for (const tag of tagsToBeAdded) {
        onAdd?.(tag, event);
      }
      onAppend?.(tagsToBeAdded, event);
    }
    if (typeof this.inputRef.current?.scrollIntoView === 'function') {
      setTimeout(() => {
        if (typeof this.inputRef.current?.scrollIntoView === 'function') {
          this.inputRef.current.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  };

  onTagClick = (event: React.MouseEvent) => {
    fire(this, 'onRemove', event);
  };

  getValueProps() {
    return {
      ref: this.inputRef,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
    };
  }

  getTagProps({ editable }: { editable: boolean }, index: number) {
    return {
      size: this.asProps.size,
      onClick: editable ? this.onTagClick : undefined,
      interactive: editable,
      ref: (node: HTMLElement | null) => {
        this.tagsRefs[index] = node;
      },
    };
  }
  getTagTextProps(_: any, index: number) {
    return {
      uid: `${this.asProps.uid}-${index}`,
      getI18nText: this.asProps.getI18nText,
    };
  }
  getInputTagsContainerProps() {
    return {
      tagsContainerAriaLabel: this.state.tagsContainerAriaLabel,
    };
  }

  setTagActionMessage(message: string) {
    this.setState({ srMessage: message });
    this.srMessageTimeout = window.setTimeout(() => {
      this.setState({ srMessage: '' });
    }, 2000);
  }

  render() {
    const SInputTags = Root;
    const { Children, styles } = this.asProps;
    const SListAriaWrapper = 'ul';

    const isAdvancedMode = isAdvanceMode(Children, ['InputTags.TagsContainer']);

    if (isAdvancedMode) {
      return sstyled(styles)(
        <>
          <SInputTags
            render={Input}
            tag={ScrollArea}
            onMouseDown={this.moveFocusToInput}
            container={this.scrollContainerRef}
            tabIndex={null}
          >
            <Children />
          </SInputTags>
          <ScreenReaderOnly role='status' aria-live='polite'>
            {this.state.srMessage}
          </ScreenReaderOnly>
        </>,
      );
    }

    const [InputComponents, RestComponents] = extractFrom(Children, ['InputTags.Value']);

    return sstyled(styles)(
      <>
        <SInputTags
          render={Input}
          tag={ScrollArea}
          onMouseDown={this.moveFocusToInput}
          container={this.scrollContainerRef}
          tabIndex={null}
        >
          <SListAriaWrapper aria-label={this.state.tagsContainerAriaLabel}>
            {RestComponents}
          </SListAriaWrapper>
          {InputComponents}
        </SInputTags>
        <ScreenReaderOnly role='status' aria-live='polite'>
          {this.state.srMessage}
        </ScreenReaderOnly>
      </>,
    );
  }
}

class Value extends Component<IInputTagsValueProps> {
  private _spacer = React.createRef<HTMLDivElement>();

  state = {
    width: '10px',
  };

  componentDidMount() {
    this.updateInputStyles(this.asProps.value!);
  }

  componentDidUpdate(prevProps: any) {
    const { value, placeholder } = this.asProps;
    if (value !== prevProps.value || placeholder !== prevProps.placeholder) {
      this.updateInputStyles(value!);
    }
  }

  handleChange = (value: string) => {
    this.updateInputStyles(value);
  };

  updateInputStyles = (value: string) => {
    const { current: spacerNode } = this._spacer;
    if (!spacerNode) return;
    const { placeholder } = this.props;
    /* for display cursor */
    let magicOffset = 2;
    if (placeholder && (value === undefined || value === '')) {
      spacerNode['innerText'] = placeholder;
      /* for [placeholder] {
          text-overflow: ellipsis;
      }*/
      magicOffset += 8;
    } else {
      spacerNode['innerText'] = value;
    }
    this.setState({
      width: `${Math.max(spacerNode['offsetWidth'], spacerNode['scrollWidth']) + magicOffset}px`,
    });
  };

  render() {
    const SValue = Root;
    const SSpacer = 'div';

    return sstyled(this.asProps.styles)(
      <>
        <SValue render={Input.Value} style={{ width: this.state.width }} />
        <SSpacer ref={this._spacer} aria-hidden />
      </>,
    );
  }
}

function InputTagsContainer({
  Children,
  tagsContainerAriaLabel,
  styles,
}: IRootComponentProps & { tagsContainerAriaLabel: string }) {
  const SListAriaWrapper = 'ul';

  return sstyled(styles)(
    <SListAriaWrapper aria-label={tagsContainerAriaLabel}>
      <Children />
    </SListAriaWrapper>,
  );
}

function InputTagContainer(props: any) {
  const STag = Root;

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (props.onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        props.onClick(event);

        return false;
      }
    },
    [props.onClick],
  );
  const interactive = props.editable || props.onClick;

  return sstyled(props.styles)(
    <STag
      data-value={props.value}
      render={TagContainer}
      tag='li'
      onKeyDown={onKeyDown}
      interactive={interactive}
    />,
  );
}
function InputTagContainerTag(props: any) {
  const STag = Root;
  const { getI18nText, editable } = props;

  return sstyled(props.styles)(
    <>
      {editable && (
        <Portal>
          <ScreenReaderOnly id={`${props.uid}-description`} aria-hidden='true'>
            {getI18nText('pressEnterToEdit')}
          </ScreenReaderOnly>
        </Portal>
      )}
      <STag
        aria-describedby={editable ? `${props.uid}-description` : undefined}
        render={TagContainer.Tag}
      />
    </>,
  );
}

export default createComponent(InputTags, {
  Value,
  TagsContainer: InputTagsContainer,
  Tag: [
    InputTagContainer,
    {
      Text: [InputTagContainerTag, { Content: Tag.Text }],
      Close: TagContainer.Close,
      Addon: TagContainer.Tag.Addon,
      Circle: TagContainer.Circle,
    },
  ],
}) as any as Intergalactic.Component<'div', InputTagsProps, InputTagsContext> & {
  Value: typeof Input.Value;
  TagsContainer: Intergalactic.Component<'ul'>;
  Tag: Intergalactic.Component<'div', InputTagsTagProps> & {
    Text: Intergalactic.Component<'div', TagProps, TagContext> & {
      Content: Intergalactic.Component<'div', TagTextProps>;
    };
    Close: typeof Tag.Close;
    Addon: typeof Tag.Addon;
    Circle: typeof Tag.Circle;
  };
};
