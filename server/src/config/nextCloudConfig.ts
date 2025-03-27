import NextcloudClient from 'nextcloud-link';

export const client = new NextcloudClient({
  url: process.env.NEXTCLOUD_URL || 'http://localhost:8080',
  password: process.env.NEXTCLOUD_PASSWORD,
  username: process.env.NEXTCLOUD_USERNAME,
});
