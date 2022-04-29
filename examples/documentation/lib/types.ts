import { NextMarkdownProps } from 'next-markdown';

export type FMatter = { title: string };

export type MyNextMarkdownProps = NextMarkdownProps<FMatter, FMatter>;

type NavItem = { title: string; props: MyNextMarkdownProps };
export type DocumentationPageProps = MyNextMarkdownProps & { nav: NavItem[] };
