import { MainLayout } from '../layouts/main';

const NotACdn = () => (
  <MainLayout title="We're not a CDN">
    <div className="container">
      <p className="mb-4">
        Do not use us as a CDN. You should not be linking to any assets that are
        hosted on our website. We are getting million of garbage requests due to
        this misuse of our assets.
      </p>
    </div>
  </MainLayout>
);

export default NotACdn;
