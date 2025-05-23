import NextcloudClient from 'nextcloud-link';

export const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});

export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  timeout: 5000,
  nextcloud: {
    username: process.env.NEXTCLOUD_USERNAME,
    password: process.env.NEXTCLOUD_PASSWORD,
  },
};
