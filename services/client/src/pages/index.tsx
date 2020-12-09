import Link from 'next/link';
import { Card } from 'antd';
import { GetServerSideProps } from 'next';
import { TagPicker } from '../components/TagPicker';
import { cookieParser } from '../helpers';

interface Props {
  initialProps?: {
    data: {
      artifacts: any;
    };
    error: true;
    message: 'Unauthorized';
  };
}

function Index({ initialProps }: Props) {
  const { data } = initialProps;
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
              key={i}
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
    props: { initialProps: parsedData }, // will be passed to the page component as props
  };
};
