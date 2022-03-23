import React from "react";
import FileButton from "./FileButton";

export default {
  title: "Atoms/FileButton",
  component: FileButton,
};

const Template = (args) => <FileButton {...args}>File</FileButton>;

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
