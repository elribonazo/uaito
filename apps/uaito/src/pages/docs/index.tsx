import DocumentationPage from '@/components/docs/DocumentationPage';
import { createDocumentationServerSideProps } from '@/utils/documentationHelpers';
import { UAITO_DOCS_ORIGIN } from '@/config';
import { RIDBProps } from '@/types';

function Docs(props: RIDBProps) {
  return (
    <DocumentationPage 
      {...props}
      showSections={true}
    />
  );
}

export const getServerSideProps = createDocumentationServerSideProps({
  origin: UAITO_DOCS_ORIGIN,
  defaultFile: 'README.md',
  pathPrefix: 'docs',
});

export default Docs;
