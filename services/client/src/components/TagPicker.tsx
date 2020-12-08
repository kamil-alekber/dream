import Tag, { TagProps } from 'antd/lib/tag';

interface Props {
  tagProps?: TagProps;
  text: string;
}

export function TagPicker({ tagProps, text }: Props) {
  return (
    <Tag color="magenta" {...tagProps}>
      {text}
    </Tag>
  );
}
