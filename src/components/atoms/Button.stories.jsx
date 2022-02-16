import React from "react";
import Button from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
};

const Template = (args) => <Button {...args}>Button</Button>;

export const Primary = Template.bind({});

Primary.args = {
  variant: "primary",
};

export const Secondary = Template.bind({});

Secondary.args = {
  variant: "secondary",
};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
};
