import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Flex } from '@semcore/flex-box';
import { Text } from '@semcore/typography';
import Radio, { RadioGroup } from '@semcore/radio';
import Checkbox from '@semcore/checkbox';
import Select from '@semcore/select';
import { ButtonTrigger } from '@semcore/base-trigger';
import Button from '@semcore/button';
import Tooltip from '@semcore/tooltip';

const Demo = () => {
  const [selected, setSelected] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string[]>([]);
  const [selectedFirst, setSelectedFirst] = React.useState(0);
  const [selectInFocus, setSelectInFocus] = React.useState(false);
  const defaultValues = {
    export: 'all',
  };
  const { handleSubmit, control, reset, errors, setError } = useForm({
    defaultValues,
  });

  const onSubmit = (data: typeof defaultValues) => {
    if (data.export === 'first') {
      if (!selectedFirst) {
        setError('export', { message: 'Require enter value' });
        return;
      } else {
        data.export = `first ${selectedFirst}`;
      }
    }
    if (data.export === 'selected') {
      if (!selectedValue.length) {
        setError('export', { message: 'Require chouse value' });
        return;
      } else {
        data.export = `selected [${selectedValue.join(',')}]`;
      }
    }
    reset(defaultValues);
    setSelected(false);
    setSelectedValue([]);
    setSelectedFirst(0);
    alert(JSON.stringify(data));
  };

  const optionsFirst = [100, 500].map((value) => ({ value, children: value }));
  const onChangeSelect = (value: number) => {
    reset({ export: 'first' });
    setSelectedFirst(value);
  };
  const onChangCheckbox = (checked: boolean, e?: React.SyntheticEvent<HTMLInputElement, Event>) => {
    const value = e?.currentTarget.value as string;
    const tmpArray = checked ? [...selectedValue, value] : selectedValue.filter((v) => v !== value);
    tmpArray.length && reset({ export: 'selected' });
    setSelectedValue(tmpArray);
  };
  const onSelectedRadio = () => {
    setSelected(!selected);
  };

  return (
    <Flex tag='form' onSubmit={handleSubmit(onSubmit)} direction='column' alignItems='flex-start'>
      <Flex direction='column' mb={4}>
        <Text size={300} tag='label' mb={4}>
          Export data
        </Text>
        <Controller
          render={({ value, ...props }) => (
            <RadioGroup {...props} value={value} size='l'>
              <Radio mb={3}>
                <Radio.Value value='all' />
                <Radio.Text>All</Radio.Text>
              </Radio>
              <Radio mb={3}>
                <Radio.Value value='selected' onChange={onSelectedRadio} />
                <Radio.Text>Selected</Radio.Text>
                {selected &&
                  [100, 500].map((v) => (
                    <Checkbox
                      size='l'
                      ml={2}
                      key={v}
                      state={value.includes('selected') && errors['export'] ? 'invalid' : 'normal'}
                    >
                      <Checkbox.Value value={v} onChange={onChangCheckbox} />
                      <Checkbox.Text children={v} />
                    </Checkbox>
                  ))}
              </Radio>
              <Radio style={{ alignItems: 'center' }}>
                <Radio.Value value='first' />
                <Radio.Text>First</Radio.Text>

                <Tooltip>
                  <Tooltip.Popper
                    id='form-select-error'
                    theme='warning'
                    placement='top'
                    visible={selectInFocus && value.includes('first') && !!errors['export']}
                  >
                    Field is requried.
                  </Tooltip.Popper>
                  <Tooltip.Trigger
                    w={'100%'}
                    inline={false}
                    onFocus={() => setSelectInFocus(true)}
                    onBlur={() => setSelectInFocus(false)}
                  >
                    <Select
                      size='l'
                      ml={2}
                      state={value.includes('first') && errors['export'] ? 'invalid' : 'normal'}
                      tag={ButtonTrigger}
                      options={optionsFirst}
                      onChange={onChangeSelect}
                    />
                  </Tooltip.Trigger>
                </Tooltip>
              </Radio>
            </RadioGroup>
          )}
          control={control}
          name='export'
        />
      </Flex>

      <Button type='submit' use='primary' theme='info' size='l'>
        Excel
      </Button>
    </Flex>
  );
};

export default Demo;
