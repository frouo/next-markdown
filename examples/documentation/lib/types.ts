import { NextMarkdownProps } from 'next-markdown';

export type MyFrontMatter = { title: string };

export type MyNextMarkdownProps = NextMarkdownProps<MyFrontMatter, MyFrontMatter>;

type NavItem = { title: string; props: MyNextMarkdownProps };
export type DocumentationPageProps = MyNextMarkdownProps & { nav: NavItem[] };
