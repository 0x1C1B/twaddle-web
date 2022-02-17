import React from "react";
import Avatar from "./Avatar";

export default {
  title: "Atoms/Avatar",
  component: Avatar,
};

const Template = (args) => (
  <div style={{ width: "100px" }}>
    <Avatar {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  value: "0xCAFEBABE",
};
