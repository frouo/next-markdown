import { TableOfContentItem as TocItem } from 'next-markdown';

export const TableOfContentItem = (item: TocItem) => {
  return (
    <ul key={item.id}>
      <li>
        <a href={`#${item.id}`}>{item.text}</a>
      </li>
      {item.subItems.length > 0 && item.subItems.map((subItem) => <TableOfContentItem key={subItem.id} {...subItem} />)}
    </ul>
  );
};
