import React from 'react';
import TabLine from 'intergalactic/tab-line';

const Demo = () => {
  const [value, onChange] = React.useState(1);
  return (
    <TabLine onChange={setValue} value={value} aria-label='Page'>
      <TabLine.Item value={0}>Overview</TabLine.Item>
      <TabLine.Item value={1}>Issues</TabLine.Item>
      <TabLine.Item value={2}>
        <TabLine.Item.Addon>
          <LinkedInM />
        </TabLine.Item.Addon>
        <TabLine.Item.Text>LinkedIn</TabLine.Item.Text>
        <TabLine.Item.Addon>
          <Badge bg='green-400'>new</Badge>
        </TabLine.Item.Addon>
      </TabLine.Item>
      <Tooltip
        title="Progress isn't available during collecting process"
        placement='top'
        role='tab'
      >
        <TabLine.Item disabled value={3}>
          Progress
        </TabLine.Item>
      </TabLine>
      {
        [
          <div id='tab-panel-1' role='tabpanel' aria-labelledby='tab-label-1' tabIndex={-1}>
            <h3>Cats</h3>
            <p>
              They are the only creatures that can simultaneously demand your attention and ignore
              you completely, while plotting world domination from the top of the refrigerator.
            </p>
          </div>,
          <div
            id='tab-panel-2'
            aria-hidden='true'
            role='tabpanel'
            aria-labelledby='tab-label-2'
            tabIndex={-1}
          >
            <h3>Dogs</h3>
            <p>
              They are the eternal optimists who believe that every stranger is a potential friend
              and every walk is an adventure, even if it's just to the mailbox.
            </p>
          </div>,
          <div
            id='tab-panel-3'
            aria-hidden='true'
            role='tabpanel'
            aria-labelledby='tab-label-3'
            tabIndex={-1}
          >
            <h3>Birds</h3>
            <p>
              They are the tiny dinosaurs who sing like they're auditioning for Broadway and have a
              knack for leaving 'gifts' on freshly washed cars.
            </p>
          </div>,
        ][value - 1]
      }
    </>
  );
};

export default Demo;
