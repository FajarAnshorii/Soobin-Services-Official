/**
 * Cloudflare D1 Database Client
 * Serverless SQL at the Edge with Zero Egress Limits
 */

export interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  error?: string;
  meta?: any;
}

export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<D1QueryResult<T>> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '69ab6d528c0c20bc8810d3edd33a11fa';
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || 'a14c0f58-46b4-4164-b067-87bd18ac7612';
    const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN || '';

    if (!apiToken) {
      console.warn('⚠️ [Cloudflare D1] CLOUDFLARE_D1_API_TOKEN is missing.');
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        results: [],
        success: false,
        error: `Cloudflare D1 HTTP Error ${res.status}: ${errorText}`,
      };
    }

    const data = await res.json();

    if (data.success && data.result && data.result.length > 0) {
      return {
        results: data.result[0].results || [],
        success: true,
        meta: data.result[0].meta,
      };
    }

    return {
      results: [],
      success: false,
      error: data.errors && data.errors.length > 0 ? data.errors[0].message : 'Unknown D1 Error',
    };
  } catch (err: any) {
    console.error('Cloudflare D1 Query Exception:', err);
    return {
      results: [],
      success: false,
      error: err.message || 'D1 connection error',
    };
  }
}
