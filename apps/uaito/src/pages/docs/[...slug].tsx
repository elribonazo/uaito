import DocumentationPage from '@/components/docs/DocumentationPage';
import { createDocumentationServerSideProps } from '@/utils/documentationHelpers';
import { UAITO_DOCS_ORIGIN } from '@/config';
import { RIDBProps } from '@/types';

interface DocsPageProps extends RIDBProps {
  showMenu?: boolean;
}

function Docs(props: DocsPageProps) {

  return (
    <DocumentationPage 
      {...props}
      backButtonHref="/docs"
    />
  );
}

export const getServerSideProps = createDocumentationServerSideProps({
  origin: UAITO_DOCS_ORIGIN,
  docsPath: "/docs",
  pathPrefix: 'docs',
});

export default Docs;
