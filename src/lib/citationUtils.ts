export interface Author {
  firstName: string;
  lastName: string;
}

export interface CitationData {
  id?: string;
  sourceType: 'journal' | 'book' | 'website' | 'thesis' | 'conference';
  authors: Author[];
  year: string;
  title: string;
  publicationDate?: string;
  // Journal specific
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  // Book specific
  publisher?: string;
  publisherCity?: string;
  edition?: string;
  // Website specific
  websiteName?: string;
  url?: string;
  accessDate?: string;
  // Thesis specific
  degree?: string;
  university?: string;
  // Conference specific
  conferenceName?: string;
}

export type CitationStyle = 'apa' | 'harvard' | 'ieee' | 'mla' | 'chicago';

export interface FormattedCitationResult {
  html: string;
  plainText: string;
  inTextParenthetical: string;
  inTextNarrative: string;
}

// Format authors for APA (Last, F. M., & Last, F. M.)
const formatAuthorsAPA = (authors: Author[]): string => {
  if (!authors || authors.length === 0) return 'Anonim';
  if (authors.length === 1) {
    const a = authors[0];
    const initial = a.firstName ? ` ${a.firstName.charAt(0).toUpperCase()}.` : '';
    return `${a.lastName || a.firstName}${initial}`;
  }
  if (authors.length === 2) {
    const a1 = `${authors[0].lastName || authors[0].firstName}${authors[0].firstName ? ' ' + authors[0].firstName.charAt(0).toUpperCase() + '.' : ''}`;
    const a2 = `${authors[1].lastName || authors[1].firstName}${authors[1].firstName ? ' ' + authors[1].firstName.charAt(0).toUpperCase() + '.' : ''}`;
    return `${a1}, & ${a2}`;
  }
  // 3 to 20 authors
  const formatted = authors.map((a) => {
    const initial = a.firstName ? ` ${a.firstName.charAt(0).toUpperCase()}.` : '';
    return `${a.lastName || a.firstName}${initial}`;
  });
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
};

// Format authors for Harvard (Last, F.M. and Last, F.M.)
const formatAuthorsHarvard = (authors: Author[]): string => {
  if (!authors || authors.length === 0) return 'Anonim';
  if (authors.length === 1) {
    const a = authors[0];
    const initial = a.firstName ? ` ${a.firstName.charAt(0).toUpperCase()}.` : '';
    return `${a.lastName || a.firstName}${initial}`;
  }
  if (authors.length === 2) {
    const a1 = `${authors[0].lastName || authors[0].firstName}${authors[0].firstName ? ' ' + authors[0].firstName.charAt(0).toUpperCase() + '.' : ''}`;
    const a2 = `${authors[1].lastName || authors[1].firstName}${authors[1].firstName ? ' ' + authors[1].firstName.charAt(0).toUpperCase() + '.' : ''}`;
    return `${a1} and ${a2}`;
  }
  const formatted = authors.map((a) => {
    const initial = a.firstName ? ` ${a.firstName.charAt(0).toUpperCase()}.` : '';
    return `${a.lastName || a.firstName}${initial}`;
  });
  return `${formatted.slice(0, -1).join(', ')} and ${formatted[formatted.length - 1]}`;
};

// Format authors for IEEE (F. M. Last and F. M. Last)
const formatAuthorsIEEE = (authors: Author[]): string => {
  if (!authors || authors.length === 0) return 'Anonim';
  const formatSingle = (a: Author) => {
    const initial = a.firstName ? `${a.firstName.charAt(0).toUpperCase()}. ` : '';
    return `${initial}${a.lastName || a.firstName}`;
  };

  if (authors.length === 1) return formatSingle(authors[0]);
  if (authors.length === 2) return `${formatSingle(authors[0])} and ${formatSingle(authors[1])}`;
  if (authors.length <= 6) {
    const formatted = authors.map(formatSingle);
    return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
  }
  return `${formatSingle(authors[0])} et al.`;
};

// Format authors for MLA (Last, First, and First Last.)
const formatAuthorsMLA = (authors: Author[]): string => {
  if (!authors || authors.length === 0) return 'Anonim';
  if (authors.length === 1) {
    return `${authors[0].lastName || authors[0].firstName}, ${authors[0].firstName || ''}`.trim().replace(/,\s*$/, '');
  }
  if (authors.length === 2) {
    const a1 = `${authors[0].lastName || authors[0].firstName}, ${authors[0].firstName || ''}`.trim().replace(/,\s*$/, '');
    const a2 = `${authors[1].firstName || ''} ${authors[1].lastName || authors[1].firstName}`.trim();
    return `${a1}, and ${a2}`;
  }
  return `${authors[0].lastName || authors[0].firstName}, ${authors[0].firstName || ''} et al.`.trim();
};

export function generateCitation(data: CitationData, style: CitationStyle): FormattedCitationResult {
  const {
    sourceType,
    authors,
    year = 'n.d.',
    title = 'Judul Dokumen',
    journalName = '',
    volume = '',
    issue = '',
    pages = '',
    doi = '',
    publisher = '',
    publisherCity = '',
    edition = '',
    websiteName = '',
    url = '',
    accessDate = '',
    degree = 'Skripsi',
    university = '',
    conferenceName = '',
  } = data;

  const cleanDoi = doi.trim();
  const doiUrl = cleanDoi ? (cleanDoi.startsWith('http') ? cleanDoi : `https://doi.org/${cleanDoi}`) : '';
  const webUrl = url.trim() || doiUrl;

  // In-text citation helpers
  const firstAuthorLast = authors.length > 0 ? (authors[0].lastName || authors[0].firstName || 'Anonim') : 'Anonim';
  let inTextParenthetical = `(${firstAuthorLast}, ${year || 'n.d.'})`;
  let inTextNarrative = `${firstAuthorLast} (${year || 'n.d.'})`;

  if (authors.length === 2) {
    const secondAuthorLast = authors[1].lastName || authors[1].firstName || '';
    inTextParenthetical = `(${firstAuthorLast} & ${secondAuthorLast}, ${year || 'n.d.'})`;
    inTextNarrative = `${firstAuthorLast} dan ${secondAuthorLast} (${year || 'n.d.'})`;
  } else if (authors.length > 2) {
    inTextParenthetical = `(${firstAuthorLast} et al., ${year || 'n.d.'})`;
    inTextNarrative = `${firstAuthorLast} et al. (${year || 'n.d.'})`;
  }

  let html = '';
  let plainText = '';

  // 1. APA 7th EDITION
  if (style === 'apa') {
    const authStr = formatAuthorsAPA(authors);
    const yrStr = `(${year || 'n.d.'}).`;

    if (sourceType === 'journal') {
      const volIss = volume ? (issue ? `<i>${volume}</i>(${issue})` : `<i>${volume}</i>`) : '';
      const volIssPlain = volume ? (issue ? `${volume}(${issue})` : `${volume}`) : '';
      const pgStr = pages ? `, ${pages}` : '';
      const linkStr = doiUrl ? ` <a href="${doiUrl}" target="_blank" class="text-primary-700 underline">${doiUrl}</a>` : (webUrl ? ` <a href="${webUrl}" target="_blank" class="text-primary-700 underline">${webUrl}</a>` : '');
      const linkPlain = doiUrl || webUrl ? ` ${doiUrl || webUrl}` : '';
      const titleStr = title ? ` ${title}.` : '';

      html = `${authStr} ${yrStr}${titleStr} <i>${journalName || 'Nama Jurnal'}</i>${volIss ? `, ${volIss}` : ''}${pgStr}.${linkStr}`;
      plainText = `${authStr} ${yrStr}${titleStr} ${journalName || 'Nama Jurnal'}${volIssPlain ? `, ${volIssPlain}` : ''}${pgStr}.${linkPlain}`;
    } else if (sourceType === 'book') {
      const edStr = edition ? ` (${edition})` : '';
      const linkStr = doiUrl ? ` <a href="${doiUrl}" target="_blank" class="text-primary-700 underline">${doiUrl}</a>` : '';
      const linkPlain = doiUrl ? ` ${doiUrl}` : '';
      const titleStr = title ? ` <i>${title}</i>` : '';
      const titlePlain = title ? ` ${title}` : '';

      html = `${authStr} ${yrStr}${titleStr}${edStr}. ${publisher || 'Penerbit'}.${linkStr}`;
      plainText = `${authStr} ${yrStr}${titlePlain}${edStr}. ${publisher || 'Penerbit'}.${linkPlain}`;
    } else if (sourceType === 'website') {
      const siteStr = websiteName ? ` ${websiteName}.` : '';
      const linkStr = webUrl ? ` <a href="${webUrl}" target="_blank" class="text-primary-700 underline">${webUrl}</a>` : '';
      const linkPlain = webUrl ? ` ${webUrl}` : '';
      const titleStr = title ? ` <i>${title}</i>.` : '';
      const titlePlain = title ? ` ${title}.` : '';

      html = `${authStr} ${yrStr}${titleStr}${siteStr}${linkStr}`;
      plainText = `${authStr} ${yrStr}${titlePlain}${siteStr}${linkPlain}`;
    } else if (sourceType === 'thesis') {
      const univStr = university ? ` [${degree}, ${university}]` : ` [${degree}]`;
      const titleStr = title ? ` <i>${title}</i>` : '';
      const titlePlain = title ? ` ${title}` : '';
      html = `${authStr} ${yrStr}${titleStr}${univStr}.${doiUrl ? ` <a href="${doiUrl}" class="text-primary-700 underline">${doiUrl}</a>` : ''}`;
      plainText = `${authStr} ${yrStr}${titlePlain}${univStr}.${doiUrl ? ` ${doiUrl}` : ''}`;
    } else {
      // conference
      const titleStr = title ? ` ${title}.` : '';
      html = `${authStr} ${yrStr}${titleStr} <i>${conferenceName || 'Nama Konferensi'}</i>.${doiUrl ? ` <a href="${doiUrl}" class="text-primary-700 underline">${doiUrl}</a>` : ''}`;
      plainText = `${authStr} ${yrStr}${titleStr} ${conferenceName || 'Nama Konferensi'}.${doiUrl ? ` ${doiUrl}` : ''}`;
    }
  }

  // 2. HARVARD STYLE
  else if (style === 'harvard') {
    const authStr = formatAuthorsHarvard(authors);
    const yrStr = year ? `${year}.` : 'n.d.';

    if (sourceType === 'journal') {
      const volIss = volume ? (issue ? `${volume}(${issue})` : `${volume}`) : '';
      const pgStr = pages ? `, pp.${pages}` : '';
      const doiStr = doiUrl ? ` Available at: <a href="${doiUrl}" class="text-primary-700 underline">${doiUrl}</a>.` : '';
      const doiPlain = doiUrl ? ` Available at: ${doiUrl}.` : '';

      html = `${authStr}, ${yrStr} ${title}. <i>${journalName || 'Nama Jurnal'}</i>${volIss ? `, ${volIss}` : ''}${pgStr}.${doiStr}`;
      plainText = `${authStr}, ${yrStr} ${title}. ${journalName || 'Nama Jurnal'}${volIss ? `, ${volIss}` : ''}${pgStr}.${doiPlain}`;
    } else if (sourceType === 'book') {
      const cityStr = publisherCity ? `${publisherCity}: ` : '';
      html = `${authStr}, ${yrStr} <i>${title}</i>. ${cityStr}${publisher || 'Penerbit'}.`;
      plainText = `${authStr}, ${yrStr} ${title}. ${cityStr}${publisher || 'Penerbit'}.`;
    } else if (sourceType === 'website') {
      const accessedStr = accessDate ? ` [Diakses ${accessDate}]` : '';
      html = `${authStr}, ${yrStr} <i>${title}</i>. [online] ${websiteName || 'Website'}. Tersedia di: <a href="${webUrl}" class="text-primary-700 underline">${webUrl}</a>${accessedStr}.`;
      plainText = `${authStr}, ${yrStr} ${title}. [online] ${websiteName || 'Website'}. Tersedia di: ${webUrl}${accessedStr}.`;
    } else {
      html = `${authStr}, ${yrStr} <i>${title}</i>. ${university || conferenceName || ''}.`;
      plainText = `${authStr}, ${yrStr} ${title}. ${university || conferenceName || ''}.`;
    }
  }

  // 3. IEEE STYLE
  else if (style === 'ieee') {
    const authStr = formatAuthorsIEEE(authors);
    inTextParenthetical = `[1]`;
    inTextNarrative = `${firstAuthorLast} [1]`;

    if (sourceType === 'journal') {
      const volIss = volume ? `vol. ${volume}` : '';
      const noIss = issue ? `no. ${issue}` : '';
      const volNo = [volIss, noIss].filter(Boolean).join(', ');
      const pgStr = pages ? `pp. ${pages}` : '';
      const details = [volNo, pgStr, year].filter(Boolean).join(', ');
      const doiStr = cleanDoi ? `, doi: ${cleanDoi}` : '';

      html = `${authStr}, "${title}," <i>${journalName || 'Nama Jurnal'}</i>, ${details}${doiStr}.`;
      plainText = `${authStr}, "${title}," ${journalName || 'Nama Jurnal'}, ${details}${doiStr}.`;
    } else if (sourceType === 'book') {
      const cityStr = publisherCity ? `${publisherCity}: ` : '';
      html = `${authStr}, <i>${title}</i>. ${cityStr}${publisher || 'Penerbit'}, ${year}.`;
      plainText = `${authStr}, ${title}. ${cityStr}${publisher || 'Penerbit'}, ${year}.`;
    } else if (sourceType === 'website') {
      const accessedStr = accessDate ? ` [Accessed: ${accessDate}]` : '';
      html = `${authStr}, "${title}," <i>${websiteName || 'Website'}</i>. [Online]. Available: <a href="${webUrl}" class="text-primary-700 underline">${webUrl}</a>.${accessedStr}`;
      plainText = `${authStr}, "${title}," ${websiteName || 'Website'}. [Online]. Available: ${webUrl}.${accessedStr}`;
    } else {
      html = `${authStr}, "${title}," ${degree || 'Thesis'}, ${university || 'Universitas'}, ${year}.`;
      plainText = `${authStr}, "${title}," ${degree || 'Thesis'}, ${university || 'Universitas'}, ${year}.`;
    }
  }

  // 4. MLA 9th EDITION
  else if (style === 'mla') {
    const authStr = formatAuthorsMLA(authors);
    inTextParenthetical = `(${firstAuthorLast}${pages ? ' ' + pages.split('-')[0].trim() : ''})`;
    inTextNarrative = `${firstAuthorLast}`;

    if (sourceType === 'journal') {
      const volStr = volume ? `vol. ${volume}` : '';
      const noStr = issue ? `no. ${issue}` : '';
      const volNo = [volStr, noStr].filter(Boolean).join(', ');
      const yrStr = year || 'n.d.';
      const pgStr = pages ? `pp. ${pages}` : '';
      const linkStr = doiUrl || webUrl ? `, ${doiUrl || webUrl}` : '';

      html = `${authStr}. "${title}." <i>${journalName || 'Nama Jurnal'}</i>${volNo ? `, ${volNo}` : ''}, ${yrStr}${pgStr ? `, ${pgStr}` : ''}${linkStr}.`;
      plainText = `${authStr}. "${title}." ${journalName || 'Nama Jurnal'}${volNo ? `, ${volNo}` : ''}, ${yrStr}${pgStr ? `, ${pgStr}` : ''}${linkStr}.`;
    } else if (sourceType === 'book') {
      html = `${authStr}. <i>${title}</i>. ${publisher || 'Penerbit'}, ${year}.`;
      plainText = `${authStr}. ${title}. ${publisher || 'Penerbit'}, ${year}.`;
    } else if (sourceType === 'website') {
      const siteStr = websiteName ? `<i>${websiteName}</i>, ` : '';
      const accessedStr = accessDate ? ` Accessed ${accessDate}.` : '';
      html = `${authStr}. "${title}." ${siteStr}${year ? year + ', ' : ''}<a href="${webUrl}" class="text-primary-700 underline">${webUrl}</a>.${accessedStr}`;
      plainText = `${authStr}. "${title}." ${websiteName ? websiteName + ', ' : ''}${year ? year + ', ' : ''}${webUrl}.${accessedStr}`;
    } else {
      html = `${authStr}. <i>${title}</i>. Diss. ${university || 'Universitas'}, ${year}.`;
      plainText = `${authStr}. ${title}. Diss. ${university || 'Universitas'}, ${year}.`;
    }
  }

  // 5. CHICAGO 17th
  else {
    const authStr = formatAuthorsMLA(authors);
    inTextParenthetical = `(${firstAuthorLast} ${year})`;
    inTextNarrative = `${firstAuthorLast} (${year})`;

    if (sourceType === 'journal') {
      const volIss = volume ? (issue ? `${volume}, no. ${issue}` : `${volume}`) : '';
      const pgStr = pages ? `: ${pages}` : '';
      const linkStr = doiUrl || webUrl ? ` ${doiUrl || webUrl}` : '';

      html = `${authStr}. "${title}." <i>${journalName || 'Nama Jurnal'}</i> ${volIss} (${year})${pgStr}.${linkStr}`;
      plainText = `${authStr}. "${title}." ${journalName || 'Nama Jurnal'} ${volIss} (${year})${pgStr}.${linkStr}`;
    } else {
      html = `${authStr}. <i>${title}</i>. ${publisherCity ? publisherCity + ': ' : ''}${publisher || 'Penerbit'}, ${year}.`;
      plainText = `${authStr}. ${title}. ${publisherCity ? publisherCity + ': ' : ''}${publisher || 'Penerbit'}, ${year}.`;
    }
  }

  return {
    html,
    plainText,
    inTextParenthetical,
    inTextNarrative,
  };
}

// Auto Fetch Metadata from CrossRef Public API by DOI or Title
export async function fetchCrossRefMetadata(doiOrTitle: string): Promise<Partial<CitationData> | null> {
  try {
    const cleanQuery = doiOrTitle.trim();
    if (!cleanQuery) return null;

    // Check if input is an incomplete DOI prefix without a slash (e.g. "10.15294")
    if (/^10\.\d{4,9}$/.test(cleanQuery)) {
      throw new Error('DOI_INCOMPLETE');
    }

    // Check if input is a complete DOI (contains 10.xxxx/...)
    const doiMatch = cleanQuery.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
    let endpoint = '';

    if (doiMatch) {
      const doi = doiMatch[0];
      endpoint = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    } else {
      endpoint = `https://api.crossref.org/works?query.title=${encodeURIComponent(cleanQuery)}&rows=1`;
    }

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'SOOBINServicesCitationGenerator/1.0 (mailto:soobinservices.id@gmail.com)',
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const isDoi = Boolean(doiMatch);
    const item = isDoi ? json.message : json.message?.items?.[0];

    if (!item) return null;

    // Extract Authors
    const authors: Author[] = (item.author || []).map((a: any) => ({
      firstName: a.given || '',
      lastName: a.family || a.name || '',
    }));

    // Extract Year
    let year = '';
    if (item.published?.['date-parts']?.[0]?.[0]) {
      year = String(item.published['date-parts'][0][0]);
    } else if (item['published-print']?.['date-parts']?.[0]?.[0]) {
      year = String(item['published-print']['date-parts'][0][0]);
    } else if (item['published-online']?.['date-parts']?.[0]?.[0]) {
      year = String(item['published-online']['date-parts'][0][0]);
    }

    const title = Array.isArray(item.title) ? item.title[0] : item.title || '';
    const journalName = Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'] || '';
    const volume = item.volume || '';
    const issue = item.issue || '';
    const pages = item.page || '';
    const doi = item.DOI || '';
    const publisher = item.publisher || '';

    return {
      sourceType: 'journal',
      authors: authors.length > 0 ? authors : [{ firstName: '', lastName: 'Penulis Anonim' }],
      year: year || new Date().getFullYear().toString(),
      title,
      journalName,
      volume,
      issue,
      pages,
      doi,
      publisher,
    };
  } catch (err) {
    console.error('Error fetching CrossRef metadata:', err);
    return null;
  }
}
