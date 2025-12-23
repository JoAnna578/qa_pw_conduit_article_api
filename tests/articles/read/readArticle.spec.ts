import { ArticlesApi } from '../../../src/api/endpoints/ArticlesApi';
import { test } from '../../_fixtures/fixtures';

test.use({ usersNumber: 2 });

test.describe('Read Article', () => {
  test('Read existing article by unauthorized user', async ({
    userRequests,
    unauthenticatedRequest,
  }) => {
    const articlesApi = new ArticlesApi(userRequests[0]);

    // najpierw user1 tworzy artykuł
    const articleData = {
      title: 'Public Article',
      description: 'Description',
      body: 'Article body',
      tagList: ['public'],
    };
    const createResponse = await articlesApi.createArticle(articleData);
    await articlesApi.assertSuccessResponseCode(createResponse);

    const slug = createResponse.body.article.slug;

    // nieautoryzowany user próbuje odczytać artykuł
    const unauthArticlesApi = new ArticlesApi(unauthenticatedRequest);
    const readResponse = await unauthArticlesApi.getArticle(slug);

    await unauthArticlesApi.assertSuccessResponseCode(readResponse);
    await unauthArticlesApi.assertArticleHasCorrectTitle(
      readResponse,
      articleData.title,
    );
  });

  test('Read article created by user1 as authorized user2', async ({
    userRequests,
  }) => {
    const articlesApiUser1 = new ArticlesApi(userRequests[0]);

    // user1 tworzy artykuł
    const articleData = {
      title: 'User1 Article',
      description: 'Desc',
      body: 'Body content',
      tagList: ['tag1'],
    };
    const createResponse = await articlesApiUser1.createArticle(articleData);
    await articlesApiUser1.assertSuccessResponseCode(createResponse);

    const slug = createResponse.body.article.slug;

    // user2 odczytuje artykuł
    const articlesApiUser2 = new ArticlesApi(userRequests[1]);
    const readResponse = await articlesApiUser2.getArticle(slug);

    await articlesApiUser2.assertSuccessResponseCode(readResponse);
    await articlesApiUser2.assertArticleHasCorrectTitle(
      readResponse,
      articleData.title,
    );
  });
});
