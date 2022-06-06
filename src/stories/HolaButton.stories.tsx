import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HolaButton } from '@/common/components/elements/HolaButton';
import { ArrowRightIcon } from '@heroicons/react/outline';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Common/Elements/HolaButton',
  component: HolaButton,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
} as ComponentMeta<typeof HolaButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HolaButton> = (args) => <HolaButton {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: 'Button',
};

export const WithIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithIcon.args = {
  children: (
    <>
      Get started <ArrowRightIcon className="ml-3 h-8 w-8" />
    </>
  ),
  size: 'lg',
};

export const Secondary = Template.bind({});
Secondary.args = {
  version: 'secondary',
  children: 'Button',
};

export const Ghost = Template.bind({});
Ghost.args = {
  version: 'ghost',
  children: 'Button',
};

export const Text = Template.bind({});
Text.args = {
  version: 'text',
  children: 'Button',
};
