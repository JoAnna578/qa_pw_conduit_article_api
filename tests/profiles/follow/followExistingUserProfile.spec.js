import { ProfilesApi } from '../../../src/api/endpoints/ProfilesApi';
import { test } from '../../_fixtures/fixtures';

test.use({ usersNumber: 2 });

test.describe('Unfollow Profile', () => {
  test('Unfollow existing user profile', async ({
    registeredUsers,
    userRequests,
  }) => {
    const user1 = registeredUsers[0];
    const user2Request = userRequests[1];
    const profilesApi = new ProfilesApi(user2Request);

    // ensure user2 is following user1 first
    await profilesApi.followProfile(user1.username);

    const response = await profilesApi.unfollowProfile(user1.username);

    await profilesApi.assertSuccessResponseCode(response);
    await profilesApi.assertFollowingHasValueFalse(response);
  });

  test('Unfollow non-existing user profile', async ({ userRequests }) => {
    const profilesApi = new ProfilesApi(userRequests[0]);
    const response = await profilesApi.unfollowProfile('nonexistentuser');

    await profilesApi.assertNotFoundResponseCode(response);
  });

  test('Unfollow existing user with empty auth token', async ({
    unauthenticatedRequest,
    registeredUsers,
  }) => {
    const profilesApi = new ProfilesApi(unauthenticatedRequest);
    const response = await profilesApi.unfollowProfile(
      registeredUsers[0].username,
    );

    await profilesApi.assertUnauthorizedResponseCode(response);
  });
});
