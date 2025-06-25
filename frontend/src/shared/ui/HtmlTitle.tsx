import { memo, useEffect } from 'react';

interface HtmlTitleProps {
  title: string;
}

export const HtmlTitle = memo(({ title }: HtmlTitleProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    // return () => {
    //   document.title = siteName;
    // };
  }, [title]);
  return <></>;
});
