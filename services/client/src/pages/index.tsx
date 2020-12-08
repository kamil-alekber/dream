import Link from 'next/link';
import { Card } from 'antd';
import { GetServerSideProps } from 'next';
import { TagPicker } from '../components/TagPicker';

interface Props {
  data?: {
    artifacts: any;
  };
}

function Index({ data }: Props) {
  const courses: { kind: string; course: string; chapters: string[]; description: string }[] = [];

  Object.keys(data?.artifacts).forEach((kind, i) => {
    courses.push(
      ...data?.artifacts[kind].map((course: string) => {
        return { kind, course: Object.keys(course)[0], chapters: Object.values(course)[0] };
      })
    );
  });

  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };

  return (
    <div>
      <Card title="Courses">
        {courses.map((item, i) => {
          return (
            <Link
              href="/[kind]/[course]/[chapter]"
              as={`/${item.kind}/${item.course}/${item.chapters[0]}`}
            >
              <a>
                <Card.Grid style={gridStyle}>
                  <h3>{item.course}</h3>
                  <p>{item?.description}</p>
                  {TagPicker({ text: item.kind })}
                </Card.Grid>
              </a>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookieParser(context?.req?.headers || {});

  const res = await fetch('http://localhost:5000', {
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
    props: { data: parsedData?.data || {} }, // will be passed to the page component as props
  };
};

function cookieParser(headers: Record<string, any>) {
  const prepareCookie = headers.cookie?.split('; ');
  const cookieMap: Record<string, string> = {};

  prepareCookie?.forEach((el) => {
    const splitted = el.split('=');
    cookieMap[splitted[0]] = splitted[1];
  });

  return cookieMap;
}
