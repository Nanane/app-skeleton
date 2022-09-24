

import { config, list } from '@keystone-6/core';
import { password, text } from '@keystone-6/core/fields';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@keystone-6/auth';
import { Lists } from '.keystone/types';

// Lists
const User: Lists.User = list({
  fields: {
    username: text({ isIndexed: 'unique', validation: { isRequired: true }}),
    email: text({ validation: { isRequired: true }}),
    password: password({ validation: { isRequired: true, length: { min: 8 } }})
  }
});

const Post: Lists.Post = list({
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: 'unique', isFilterable: true }),
    content: text(),
  },
});

// use User list for authentication
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'username',
  secretField: 'password',
  initFirstItem: {
    skipKeystoneWelcome: false,
    fields: ['username', 'email', 'password']
  }
});

// use stateless sessions
const session = statelessSessions({
  secret: 'atQwtneDln20crFbFatA6GnzjZA1KLwUrJQHo8HA',
});

export default withAuth(
  config({
    db: { provider: 'sqlite', url: 'file:./app.db' },
    experimental: {
      generateNextGraphqlAPI: true,
      generateNodeAPI: true,
    },
    session,
    lists: { Post, User },
  })
);
