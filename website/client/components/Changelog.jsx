import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Tag from '@semcore/tag';
import { Text } from '@semcore/typography';

export const List = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0 0 20px 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  & + & {
    margin-top: 10px;
  }
`;

const TagStyled = styled(Tag)`
  margin-right: 16px;
  margin-top: 4px;
  width: 80px;
  flex-shrink: 0;
`;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getLabel(tag) {
  if (!tag) return null;
  let label = <strong>{tag}</strong>;
  switch (tag) {
    case 'Added':
      label = (
        <TagStyled size="l" color="green-500">
          {tag}
        </TagStyled>
      );
      break;
    case 'Fixed':
      label = (
        <TagStyled size="l" color="blue-500">
          {tag}
        </TagStyled>
      );
      break;
    case 'Changed':
    case 'Removed':
    case 'Deprecated':
      label = (
        <TagStyled size="l" color="orange-500">
          {tag}
        </TagStyled>
      );
      break;
    case 'BREAK':
    case 'Security':
      label = (
        <TagStyled size="l" color="red-500">
          {tag}
        </TagStyled>
      );
  }
  return label;
}

export function renderListItem({ labelText, text }) {
  return (
    <ListItem>
      {getLabel(labelText)}
      <div>{text}</div>
    </ListItem>
  );
}

class Changelog extends React.Component {
  renderers() {
    return {
      list: (props) => <List {...props} />,
      listItem: function ({ children }) {
        return renderListItem({
          labelText: children[0]?.props?.children[0]?.props?.children,
          text: children[1],
        });
      },
      heading: function ({ level, children }) {
        if (level === 2) {
          const version = children[0]?.props?.children;
          return (
            <Text tag="h3">
              <Text>{version}</Text>
              <small>{children[1]}</small>
            </Text>
          );
        }
        if (level === 3) {
          const name = children[0]?.props?.children;
          return (
            <Text tag="h4" mb={1}>
              <Text fontWeight="bold" mr={2}>
                {capitalizeFirstLetter(name.replace('@semcore/', ''))}
              </Text>
              (<small>{children}</small>)
            </Text>
          );
        }
        const Tag = `h${level}`;
        return <Tag>{children}</Tag>;
      },
      // link: ({ href, ...props }) => {
      //   if (href.startsWith('/')) {
      //     return <Link to={href} {...props} />;
      //   } else {
      //     return <a href={href} {...props} />;
      //   }
      // },
      // paragraph: () => null,
    };
  }
  render() {
    return <ReactMarkdown source={String(this.props.children)} renderers={this.renderers()} />;
  }
}

export default Changelog;
