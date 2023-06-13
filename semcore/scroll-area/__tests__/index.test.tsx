import React from 'react';
import { testing, snapshot, shared as testsShared } from '@semcore/jest-preset-ui';
const { cleanup, render } = testing;

const { shouldSupportClassName, shouldSupportRef } = testsShared;
import ScrollArea from '../src';

describe('ScrollArea', () => {
  afterEach(cleanup);

  shouldSupportClassName(ScrollArea);
  shouldSupportRef(ScrollArea);

  test('should support render function for children', () => {
    const component = <ScrollArea>{() => <ScrollArea.Container />}</ScrollArea>;
    render(component);

    expect(document.querySelectorAll('[data-ui-name="ScrollArea.Container"]').length).toBe(1);
  });

  xtest('should support area attributes to bar', () => {
    const { queryByTestId } = render(
      <ScrollArea h={200} w={200} shadow>
        {[...new Array(10)].map((_, i) => (
          <div key={i} style={{ width: '100px', height: '100px' }} />
        ))}
        <ScrollArea.Bar orientation='vertical' data-testid="bar"/>
      </ScrollArea>
    );
    expect(queryByTestId('bar').attributes['aria-valuemin']).toBeTruthy();
    expect(queryByTestId('bar').attributes['aria-valuenow']).toBeTruthy();
    expect(queryByTestId('bar').attributes['aria-valuemax']).toBeTruthy();
  })

  xtest('should support shadow display on container', async () => {
    const component = (
      <ScrollArea h={200} w={200} shadow>
        {[...new Array(3)].map((_, ind) => (
          <div key={`parent-${ind}`} style={{ display: 'flex', width: '300px' }}>
            {[...new Array(3)].map((_, ind) => (
              <div key={ind} style={{ width: '100px', height: '100px' }} />
            ))}
          </div>
        ))}
      </ScrollArea>
    );

    expect(await snapshot(component)).toMatchImageSnapshot();
  });
});

describe('ScrollArea.Container', () => {
  afterEach(cleanup);

  shouldSupportClassName(ScrollArea.Container, ScrollArea);
  shouldSupportRef(ScrollArea.Container, ScrollArea);
});
