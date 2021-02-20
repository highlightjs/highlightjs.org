import GitHubAvatar from '../components/gtihub-avatar';
import { Markdown } from '../components/markdown';
import Timestamp from '../components/timestamp';
import { MainLayout } from '../layouts/main';
import styles from '../styles/News.module.scss';

const News = ({ releases }) => {
  return (
    <MainLayout>
      <div className="container">
        <h1>Project News</h1>

        <section>
          {releases.map((release) => (
            <article className={styles.newsArticle}>
              <header className={styles.newsHeader}>
                <h2 className="mb-0">
                  <a href={release.url}>{release.name}</a>
                </h2>
                <div>
                  <Timestamp timestamp={release.published_at} />
                  <span className="mx-2">&middot;</span>
                  <GitHubAvatar username={release.author.login} size={24} />
                </div>
              </header>

              <Markdown body={release.body} />
            </article>
          ))}
        </section>
      </div>
    </MainLayout>
  );
};

// This function gets called at build time
export async function getStaticProps() {
  const res = await fetch(
    'https://api.github.com/repos/highlightjs/highlight.js/releases?per_page=5',
  );
  const releases = await res.json();

  return {
    props: {
      releases,
    },
  };
}

export default News;
