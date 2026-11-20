import type { APIRequestContext } from '@playwright/test';

export type WikipediaLanguage = {
  code: string;
  englishName: string;
  nativeName: string;
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getOptionalString(record: JsonRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

export class WikipediaLanguageApi {
  constructor(private readonly request: APIRequestContext) {}

  async getActiveLanguages(): Promise<WikipediaLanguage[]> {
    const response = await this.request.get('https://meta.wikimedia.org/w/api.php', {
      params: {
        action: 'sitematrix',
        format: 'json',
        smtype: 'language',
      },
    });

    if (!response.ok()) {
      throw new Error(`Wikipedia language API request failed with status ${response.status()}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !isRecord(payload.sitematrix)) {
      throw new Error('Wikipedia language API returned an invalid sitematrix response');
    }

    return Object.values(payload.sitematrix)
      .flatMap((entry): WikipediaLanguage[] => {
        if (!isRecord(entry) || !Array.isArray(entry.site)) {
          return [];
        }

        const code = getOptionalString(entry, 'code');
        if (!code) {
          return [];
        }

        const hasWikipedia = entry.site.some((site: unknown) => {
          if (!isRecord(site)) {
            return false;
          }

          const url = getOptionalString(site, 'url');
          const dbname = getOptionalString(site, 'dbname');
          return url?.includes('.wikipedia.org') === true && dbname?.endsWith('wiki') === true;
        });

        if (!hasWikipedia) {
          return [];
        }

        const englishName = getOptionalString(entry, 'name') ?? code;
        return [{
          code,
          englishName,
          nativeName: getOptionalString(entry, 'localname') ?? englishName,
        }];
      })
      .sort((first, second) => first.englishName.localeCompare(second.englishName));
  }
}
