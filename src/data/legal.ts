import { useEffect, useState } from 'react';

import { mockLegalDocuments } from '@/mocks/legal';

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  kind: 'terms' | 'privacy';
  title: string;
  /** Exact "Última actualización" line of the document. */
  lastUpdated: string;
  /** Paragraphs between the title and the first section. */
  intro: string[];
  sections: LegalSection[];
};

/** Response of GET /legal/documents/current. */
export type LegalDocuments = {
  terms: LegalDocument;
  privacy: LegalDocument;
};

/**
 * Current Terms and Conditions and Privacy Notice. Uses the mocks in
 * `src/mocks/legal.ts` for now; replace the body with the call to
 * GET /legal/documents/current without touching the screens.
 */
export async function getCurrentLegalDocuments(): Promise<LegalDocuments> {
  return mockLegalDocuments;
}

/** Loads one current legal document; `null` while it is loading. */
export function useLegalDocument(kind: LegalDocument['kind']): LegalDocument | null {
  const [document, setDocument] = useState<LegalDocument | null>(null);

  useEffect(() => {
    let active = true;
    getCurrentLegalDocuments().then((documents) => {
      if (active) {
        setDocument(documents[kind]);
      }
    });
    return () => {
      active = false;
    };
  }, [kind]);

  return document;
}
