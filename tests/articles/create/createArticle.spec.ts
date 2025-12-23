import { ArticlesApi } from '../../../src/api/endpoints/ArticlesApi';
import { test } from '../../_fixtures/fixtures';

test.use({ usersNumber: 2 });

test.describe('Create Article', () => {
  test('Create article with empty tags array', async ({
    registeredUsers,
    userRequests,
  }) => {
    const userRequest = userRequests[0];
    const articlesApi = new ArticlesApi(userRequest);

    const articleData = {
      title: 'Test Article',
      description: 'Test description',
      body: 'Test body',
      tagList: [], // empty tags array
    };

    const response = await articlesApi.createArticle(articleData);

    await articlesApi.assertSuccessResponseCode(response);
    await articlesApi.assertArticleHasCorrectTitle(response, articleData.title);
    await articlesApi.assertArticleHasEmptyTags(response);
  });

  test('Create article with empty body', async ({ userRequests }) => {
    const articlesApi = new ArticlesApi(userRequests[0]);

    const articleData = {
      title: 'Title with empty body',
      description: 'Description',
      body: '',
      tagList: ['test'],
    };

    const response = await articlesApi.createArticle(articleData);

    await articlesApi.assertBadRequestResponseCode(response);
  });

  test('Create article with empty title', async ({ userRequests }) => {
    const articlesApi = new ArticlesApi(userRequests[0]);

    const articleData = {
      title: '',
      description: 'Description',
      body: 'Some body',
      tagList: ['tag1'],
    };

    const response = await articlesApi.createArticle(articleData);

    await articlesApi.assertBadRequestResponseCode(response);
  });

  test('Create article by unauthorized user', async ({
    unauthenticatedRequest,
  }) => {
    const articlesApi = new ArticlesApi(unauthenticatedRequest);

    const articleData = {
      title: 'Unauthorized Article',
      description: 'Desc',
      body: 'Body',
      tagList: ['tag'],
    };

    const response = await articlesApi.createArticle(articleData);

    await articlesApi.assertUnauthorizedResponseCode(response);
  });

  test('Create article with all fields filled', async ({ userRequests }) => {
    const articlesApi = new ArticlesApi(userRequests[0]);

    const articleData = {
      title: 'Full Article',
      description: 'Full description',
      body: 'This is the full body content',
      tagList: ['tag1', 'tag2'],
    };

    const response = await articlesApi.createArticle(articleData);

    await articlesApi.assertSuccessResponseCode(response);
    await articlesApi.assertArticleHasCorrectTitle(response, articleData.title);
    await articlesApi.assertArticleHasCorrectBody(response, articleData.body);
    await articlesApi.assertArticleHasTags(response, articleData.tagList);
  });
});
