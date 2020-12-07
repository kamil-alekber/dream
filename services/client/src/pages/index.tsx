import Link from 'next/link';

function Index() {
  return (
    <div>
      Index to course{' '}
      <Link href="/[kind]/[course]/[chapter]" as="/js/intro_js/1_global">
        <a>JS intro</a>
      </Link>
    </div>
  );
}

export default Index;
