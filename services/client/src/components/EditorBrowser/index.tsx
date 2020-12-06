import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

export { Editor };
