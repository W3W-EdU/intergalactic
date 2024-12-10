import React from 'react';
import AddFilter from '@semcore/ui/add-filter';
import Select from '@semcore/select';
import Button from '@semcore/button';
import { Flex } from '@semcore/flex-box';
import SearchM from '@semcore/icon/Search/m';
import { ButtonLink } from '@semcore/button';
import CloseM from '@semcore/icon/Close/m';
import { Text } from '@semcore/typography';
import Radio, { RadioGroup } from '@semcore/radio';
import Textarea from '@semcore/textarea';
import Input from '@semcore/input';
import { FilterTrigger } from '@semcore/ui/base-trigger';

const selectOptions = [
  { value: 'Option 1', children: 'Option 1' },
  { value: 'Option 2', children: 'Option 2' },
];

type KeywordDataItem = {
  value: string;
  displayValue: string;
} | null;

type KeywordProps = {
  value: KeywordDataItem;
  onChange: (v: KeywordDataItem) => void;
};
const Keywords = ({ value, onChange }: KeywordProps) => {
  const [textAreaValue, setTextAreaValue] = React.useState(value?.value ?? '');

  const applyFilters = () => {
    if (!textAreaValue) {
      return;
    }
    const countLine = textAreaValue.split(/\n/g).filter(Boolean) || [];
    const value = textAreaValue;
    const displayValue = String(countLine.length || (textAreaValue && 1));

    onChange({
      value,
      displayValue,
    });
  };

  return (
    <>
      <Text tag='label' htmlFor='textarea' size={200} color='text-primary'>
        Enter keywords separated by commas or one per line. For exact matches, enter your keyword
        with square brackets around it.
      </Text>
      <RadioGroup my={4} defaultValue='1' direction='row'>
        <Radio>
          <Radio.Value value='1' />
          <Radio.Text>All keywords</Radio.Text>
        </Radio>
        <Radio ml={6}>
          <Radio.Value value='2' />
          <Radio.Text>Any keywords</Radio.Text>
        </Radio>
      </RadioGroup>
      <Textarea value={textAreaValue} onChange={setTextAreaValue} h={132} id='textarea' />
      <Flex mt={5}>
        <Button use='primary' theme='info' onClick={applyFilters}>
          Apply
        </Button>
        <Button
          ml={2}
          onClick={() => {
            onChange(null);
          }}
        >
          Clear all
        </Button>
      </Flex>
    </>
  );
};

type FilterData = {
  name: string;
  fullname: string;
  size: string;
  position: string;
  device: string;
  keywords: KeywordDataItem | null;
  link: string;
};
const defaultFilterData = {
  name: '',
  fullname: '',
  size: '',
  keywords: null,
  device: '',
  position: '',
  link: '',
};
const AddFilterExample = () => {
  const [filterData, setFilterData] = React.useState<FilterData>(() => defaultFilterData);

  const clearField = React.useCallback(
    (name: keyof FilterData) => {
      const valueType = typeof filterData[name];
      const tempData = { ...filterData, [name]: valueType === 'string' ? '' : null };
      setFilterData(tempData);
    },
    [filterData],
  );

  return (
    <Flex gap={2}>
      <Input inline={false} w={'auto'}>
        <Input.Addon>
          <SearchM />
        </Input.Addon>
        <Input.Value
          w={110}
          value={filterData['name']}
          onChange={(v: string) => {
            setFilterData({ ...filterData, name: v });
          }}
          placeholder={'Filter by name'}
        />
        {Boolean(filterData['name']) && (
          <Input.Addon>
            <ButtonLink
              use='secondary'
              addonLeft={CloseM}
              aria-label='Clear'
              onClick={() => {
                clearField('name');
              }}
            />
          </Input.Addon>
        )}
      </Input>

      <Flex>
        <Select placeholder='Everywhere' options={selectOptions} neighborLocation={'right'} />
        <Input w={125} neighborLocation={'both'}>
          <Input.Value
            placeholder={'Filter by fullname'}
            onChange={(v) => {
              setFilterData({ ...filterData, fullname: v });
            }}
            value={filterData['fullname']}
            aria-label='Filter by fullname'
          />
          {Boolean(filterData['fullname']) && (
            <Input.Addon>
              <ButtonLink
                use='secondary'
                addonLeft={CloseM}
                aria-label='Clear'
                onClick={() => {
                  clearField('fullname');
                }}
              />
            </Input.Addon>
          )}
        </Input>
        <Button neighborLocation={'left'}>
          <Button.Addon>
            <SearchM />
          </Button.Addon>
        </Button>
      </Flex>

      <Select
        onChange={(v: any) => {
          setFilterData({ ...filterData, size: v });
        }}
      >
        <Select.Trigger
          tag={FilterTrigger}
          placeholder='Size'
          onClear={() => {
            return clearField('size');
          }}
        >
          {'Size'}: {filterData.size}
        </Select.Trigger>
        <Select.Menu>
          {sizes.map((item, idx) => (
            <Select.Option key={idx} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select.Menu>
      </Select>

      <AddFilter
        filterData={filterData}
        onClearAll={() => {
          setFilterData(defaultFilterData);
        }}
        gap={2}
        flexWrap
      >
        <AddFilter.Dropdown name='keywords' displayName='Keywords'>
          <AddFilter.Dropdown.Trigger placeholder='Exclude keywords'>
            {`Exclude: ${filterData.keywords?.displayValue} keywords`}
          </AddFilter.Dropdown.Trigger>

          <AddFilter.Dropdown.Popper
            w={325}
            p='8px 8px 16px'
            role='dialog'
            aria-label='List of excluded keywords'
            aria-modal='false'
          >
            <Keywords
              onChange={(v) => {
                setFilterData({ ...filterData, keywords: v });
              }}
              value={filterData.keywords}
            />
          </AddFilter.Dropdown.Popper>
        </AddFilter.Dropdown>

        <AddFilter.Input name={'position'} displayName={'Position'}>
          <AddFilter.Input.Addon>
            <SearchM />
          </AddFilter.Input.Addon>
          <AddFilter.Input.Value
            w={110}
            value={filterData['position']}
            onChange={(v) => {
              setFilterData({ ...filterData, position: v });
            }}
            placeholder={'Filter by position'}
          />
          {Boolean(filterData['position']) && (
            <AddFilter.Input.Addon>
              <AddFilter.Input.Clear
                use='secondary'
                addonLeft={CloseM}
                aria-label='Clear'
                onClick={() => {
                  clearField('position');
                }}
              />
            </AddFilter.Input.Addon>
          )}
        </AddFilter.Input>

        <AddFilter.Select
          name='device'
          displayName='Device'
          onChange={(v: any) => {
            setFilterData({ ...filterData, device: v });
          }}
        >
          <AddFilter.Select.Trigger
            placeholder='Device'
            onClear={() => {
              clearField('device');
            }}
          >
            {'Device'}: {filterData.device}
          </AddFilter.Select.Trigger>
          <AddFilter.Select.Menu>
            {devices.map((item, idx) => (
              <AddFilter.Select.Option key={idx} value={item}>
                {item}
              </AddFilter.Select.Option>
            ))}
          </AddFilter.Select.Menu>
        </AddFilter.Select>
      </AddFilter>
    </Flex>
  );
};

export default AddFilterExample;

const devices = ['Desktop', 'Phone', 'Tablet'];
const sizes = ['Small', 'Medium', 'Large'];
