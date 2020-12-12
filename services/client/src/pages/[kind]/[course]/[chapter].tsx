import { GetServerSideProps } from 'next';
import { Courses } from '../../../components/courses/Courses';
import { cookieParser } from '../../../helpers';
import { BasicLayout } from '../../../components/BasicLayout';
import matter from 'gray-matter';

export interface Doc {
  content: string;
  data: Record<string, string>;
  excerpt: string;
  isEmpty: boolean;
}
interface Props {
  initialProps: {
    data?: {
      chapters: string[];
      doc: Doc;
      code: string;
    };
    error: boolean;
    message: string;
  };
}

function Index(props: Props) {
  return (
    <BasicLayout chapters={props?.initialProps?.data?.chapters}>
      <Courses code={props?.initialProps?.data?.code} doc={props?.initialProps?.data?.doc} />
    </BasicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.query.chapter === 'worker-javascript.js') {
    return {
      props: { initialProps: null }, // will be passed to the page component as props
    };
  }
  const cookies = cookieParser(context?.req?.headers || {});
  let url = `http://localhost:5000/artifacts`;

  Object.keys(context.query).forEach((key, i) => {
    url += `${i === 0 ? '?' : '&'}${key}=${context.query[key]}`;
  });

  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: cookies?.docker,
    },
  });

  const parsedData = await res.json();
  if (parsedData?.data) {
    const mattered = matter(parsedData?.data?.doc, { excerpt: true });
    parsedData.data.doc = mattered;
  }

  return {
    props: { initialProps: parsedData }, // will be passed to the page component as props
  };
};

export default Index;
