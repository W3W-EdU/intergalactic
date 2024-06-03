import React from 'react';
import { snapshot } from '@semcore/testing-utils/snapshot';
import { expect, test, describe, beforeEach, vi } from '@semcore/testing-utils/vitest';
import { cleanup, fireEvent, render, userEvent } from '@semcore/testing-utils/testing-library';
import { axe } from '@semcore/testing-utils/axe';

import InputNumber from '../src';

describe('InputNumber', () => {
  beforeEach(cleanup);

  test.concurrent('Should accept int numbers', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input1' value='' onChange={spy} />
      </InputNumber>,
    );
    const input = getByTestId('input1');
    fireEvent.change(input, { target: { value: '123' } });
    expect(spy).toBeCalledWith('123', expect.anything());
  });

  test.sequential('Should accept float numbers', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input2' value='' onChange={spy} />
      </InputNumber>,
    );
    const input = getByTestId('input2');
    fireEvent.change(input, { target: { value: '123.4' } });
    expect(spy).toBeCalledWith('123.4', expect.anything());
  });

  test.concurrent('Should accept format in int numbers', async () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input3' value='' onChange={spy} />
      </InputNumber>,
    );

    const input = getByTestId('input3') as HTMLInputElement;

    await userEvent.keyboard('[Tab]');
    await userEvent.keyboard('12345');

    expect(spy).lastCalledWith('12345', expect.anything());
    expect(input.value).toBe('12,345');
  });

  test.sequential('Should accept format in float numbers', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input4' value='' onChange={spy} />
      </InputNumber>,
    );

    const input = getByTestId('input4') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345.4' } });
    expect(spy).toBeCalledWith('12345.4', expect.anything());
    expect(input.value).toBe('12,345.4');
  });

  test.sequential('Should correct round float numbers with step less than 1', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input5' value='0.26' onChange={spy} step={0.1} />
      </InputNumber>,
    );
    const input = getByTestId('input5');
    fireEvent.blur(input);
    expect(spy).toBeCalledWith('0.3', expect.anything());
  });

  test.sequential('Should correct round float numbers with step more than 1', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input6' value='42.2' onChange={spy} step={5} />
      </InputNumber>,
    );
    const input = getByTestId('input6');
    fireEvent.blur(input);
    expect(spy).toBeCalledWith('40', expect.anything());
  });

  test.concurrent('Should not accept letters', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input7' value='' onChange={spy} />
      </InputNumber>,
    );

    const input = getByTestId('input7');
    fireEvent.change(input, { target: { value: 'YOU SHELL NOT PASS' } });
    expect(spy).not.toBeCalled();
  });

  test.concurrent('Should not accept value which is bigger than max prop', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input8' value={'100000'} max={10} onChange={spy} />
      </InputNumber>,
    );
    const input = getByTestId('input8');
    fireEvent.blur(input);
    expect(spy).toBeCalledWith('10', expect.anything());
  });

  test.sequential('Should not accept value which is smaller than min prop', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input9' value={'199'} min={200} onChange={spy} />
      </InputNumber>,
    );
    const input = getByTestId('input9');
    fireEvent.blur(input);
    expect(spy).toBeCalledWith('200', expect.anything());
  });

  test.concurrent('Should support inputs up/down buttons click', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input10' defaultValue={'0'} onChange={spy} />
        <InputNumber.Controls data-testid='controls' />
      </InputNumber>,
    );
    const controls = getByTestId('controls');

    const arrowUp = controls.querySelectorAll('button')[0];
    fireEvent.click(arrowUp);
    expect(spy).lastCalledWith('1', expect.anything());
    const arrowDown = controls.querySelectorAll('button')[1];
    fireEvent.click(arrowDown); // 0
    fireEvent.click(arrowDown); // -1
    expect(spy).lastCalledWith('-1', expect.anything());
  });

  test.concurrent('Should support inputs up/down buttons click with formatted number', async () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <InputNumber>
        <InputNumber.Value data-testid='input11' defaultValue={'0'} onChange={spy} />
        <InputNumber.Controls data-testid='controls' />
      </InputNumber>,
    );
    const controls = getByTestId('controls');
    const input = getByTestId('input11') as HTMLInputElement;

    await userEvent.keyboard('[Tab]');
    await userEvent.keyboard('12345');

    const arrowUp = controls.querySelectorAll('button')[0];
    await userEvent.click(arrowUp);
    expect(spy).lastCalledWith('12346', expect.anything());
    const arrowDown = controls.querySelectorAll('button')[1];
    await userEvent.click(arrowDown); // 12345
    await userEvent.click(arrowDown); // 12344
    expect(spy).lastCalledWith('12344', expect.anything());
    expect(input.value).toBe('12,344');
  });

  test.concurrent('Should support sizes', async ({ task }) => {
    const component = (
      <React.Fragment>
        <InputNumber size='m'>
          <InputNumber.Value />
          <InputNumber.Controls showControls />
        </InputNumber>
        <InputNumber size='l'>
          <InputNumber.Value />
          <InputNumber.Controls showControls />
        </InputNumber>
      </React.Fragment>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should support disabled prop', async ({ task }) => {
    const component = (
      <React.Fragment>
        <InputNumber>
          <InputNumber.Value disabled />
        </InputNumber>
        <InputNumber>
          <InputNumber.Value disabled />
          <InputNumber.Controls showControls />
        </InputNumber>
      </React.Fragment>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should support showControls prop', async ({ task }) => {
    const component = (
      <React.Fragment>
        <InputNumber>
          <InputNumber.Value />
        </InputNumber>
        <InputNumber>
          <InputNumber.Value />
          <InputNumber.Controls showControls />
        </InputNumber>
      </React.Fragment>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should support view controls', async ({ task }) => {
    const component = (
      <InputNumber {...{ focused: true }}>
        <InputNumber.Value id='input' />
        <InputNumber.Controls />
      </InputNumber>
    );

    await expect(
      await snapshot(component, {
        actions: {
          focus: '#input',
        },
      }),
    ).toMatchImageSnapshot(task);
  });

  test.sequential('Should support controls hover', async ({ task }) => {
    const component = (
      <InputNumber>
        <InputNumber.Value />
        <InputNumber.Controls showControls id={'controls'} />
      </InputNumber>
    );

    await expect(
      await snapshot(component, {
        actions: {
          hover: 'css=#controls > button',
        },
      }),
    ).toMatchImageSnapshot(task);
  });

  test('a11y', async () => {
    const { container } = render(
      <InputNumber>
        <InputNumber.Value aria-label='input-number' value='23' />
        <InputNumber.Controls showControls />
      </InputNumber>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
