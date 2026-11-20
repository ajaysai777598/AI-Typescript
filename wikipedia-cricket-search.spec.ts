import { test, expect } from './fixtures/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaSearchResultsPage } from './pages/WikipediaSearchResultsPage';

type WikipediaSearchResult = {
  pageid: number;
  title: string;
  snippet: string;
  size: number;
  wordcount: number;
  timestamp: string;
};

type WikipediaSearchResponse = {
  query: {
    searchinfo: { totalhits: number };
    search: WikipediaSearchResult[];
  };
};

async function searchWikipediaApi(
  request: APIRequestContext,
  query: string,
  limit = 10,
): Promise<{ response: APIResponse; body: WikipediaSearchResponse }> {
  const response = await request.get('https://en.wikipedia.org/w/api.php', {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: String(limit),
      format: 'json',
    },
  });

  return { response, body: await response.json() as WikipediaSearchResponse };
}

test('searches Wikipedia for Cricket and validates the search API', async ({ page, request }) => {
  const homePage = new WikipediaHomePage(page);
  const resultsPage = new WikipediaSearchResultsPage(page);

  await homePage.open();
  await homePage.enterSearchQuery('Cricket');

  const searchRequestPromise = page.waitForRequest((browserRequest) => {
    const url = new URL(browserRequest.url());
    return url.pathname.endsWith('/search-redirect.php')
      && url.searchParams.get('search')?.toLowerCase() === 'cricket';
  });
  await homePage.submitSearchWithEnter();
  const searchRequest = await searchRequestPromise;

  expect(searchRequest.method()).toBe('GET');
  expect(new URL(searchRequest.url()).searchParams.get('search')).toBe('Cricket');
  await expect(page).toHaveURL(/wikipedia\.org\/wiki\//);
  await expect(resultsPage.body).toContainText('Cricket');

  const { response: apiResponse, body: responseBody } = await searchWikipediaApi(request, 'Cricket');

  expect(apiResponse.ok()).toBeTruthy();
  expect(apiResponse.headers()['content-type']).toContain('application/json');
  expect(responseBody.query.searchinfo.totalhits).toBeGreaterThan(0);
  expect(responseBody.query.search.length).toBeGreaterThan(0);
  expect(responseBody.query.search.map((result) => result.title)).toContain('Cricket');
  expect(responseBody.query.search[0]).toEqual(expect.objectContaining({
    pageid: expect.any(Number),
    title: expect.any(String),
    snippet: expect.any(String),
    size: expect.any(Number),
    wordcount: expect.any(Number),
    timestamp: expect.any(String),
  }));
});

test.describe('Wikipedia Search API exploratory validation', () => {
  test('respects the requested result limit', async ({ request }) => {
    const { response, body } = await searchWikipediaApi(request, 'Cricket', 1);

    expect(response.ok()).toBeTruthy();
    expect(body.query.search).toHaveLength(1);
    expect(body.query.searchinfo.totalhits).toBeGreaterThanOrEqual(body.query.search.length);
  });

  test('accepts special characters in the search query', async ({ request }) => {
    const { response, body } = await searchWikipediaApi(request, 'Café & 東京', 3);

    expect(response.ok()).toBeTruthy();
    expect(body.query.search.length).toBeLessThanOrEqual(3);
    expect(body.query.searchinfo.totalhits).toEqual(expect.any(Number));
  });

  test('returns an empty result list for an unmatched query', async ({ request }) => {
    const { response, body } = await searchWikipediaApi(
      request,
      'zxqv-no-wikipedia-page-9283746501',
    );

    expect(response.ok()).toBeTruthy();
    expect(body.query.search).toEqual([]);
    expect(body.query.searchinfo.totalhits).toBe(0);
  });
});
