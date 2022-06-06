import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ActivityCard from '@/common/components/elements/ActivityCard2';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Common/Elements/ActivityCard',
  component: ActivityCard,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
} as ComponentMeta<typeof ActivityCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ActivityCard> = (args) => <ActivityCard {...args} />;

export const BidActivity = Template.bind({});
BidActivity.args = {};
