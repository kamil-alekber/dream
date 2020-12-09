import { GetServerSideProps } from 'next';
import { Courses } from '../../../components/courses/Courses';
import { cookieParser } from '../../../helpers';
import { BasicLayout } from '../../../components/BasicLayout';
interface Props {
  initialProps: {
    data?: {
      chapters: string[];
      files: string[];
    };
    error: boolean;
    message: string;
  };
}

function Index(props: Props) {
  return (
    <BasicLayout {...props.initialProps.data}>
      <Courses />
    </BasicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookieParser(context?.req?.headers || {});
  let url = `http://localhost:5000/artifacts?`;

  Object.keys(context.query).forEach((key, i) => {
    url += `${i === 0 ? '' : '&'}${key}=${context.query[key]}`;
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

  return {
    props: { initialProps: parsedData }, // will be passed to the page component as props
  };
};

export default Index;
