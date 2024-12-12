import { expect, userEvent, within } from '@storybook/test';

export async function DropdownMenuTest({ canvasElement }: { canvasElement: HTMLElement }) {
  const canvas = within(canvasElement);

  const button = within(document.body).queryByText("Export");
  if (!(button)) {
    throw new Error('Section 1 not found');
  }
 await userEvent.click(button);
 

}
