import * as fs from 'fs';
import * as path from 'path';

import * as matter from 'gray-matter';

import { BlurredBackground } from '../components/blurredbackground';
import GitHubAvatar from '../components/gtihub-avatar';
import { Markdown } from '../components/markdown';
import Timestamp from '../components/timestamp';
import { MainLayout } from '../layouts/main';

const NEWS_DIR = path.resolve(process.cwd(), 'news');
const GH_API =
  'https://api.github.com/repos/highlightjs/highlight.js/releases?per_page=5';

interface Props {
  articles: NewsArticle[];
}

interface NewsArticle {
  url: string | null;
  title: string;
  author: string;
  date: string;
  category: string;
  markdown: string;
}

function parseFrontMatter(filename: string): NewsArticle {
  const article = matter.read(path.resolve(NEWS_DIR, filename));

  return {
    url: null,
    title: article.data.title,
    author: article.data.author,
    date: article.data.date.toISOString(),
    category: article.data.category,
    markdown: article.content,
  };
}

function parseGitHubApiResponse(release: any): NewsArticle {
  return {
    url: release.html_url,
    title: release.name,
    author: release.author.login,
    date: release.published_at,
    category: 'release',
    markdown: release.body,
  };
}

// This function gets called at build time
export async function getStaticProps() {
  const news = fs.readdirSync(NEWS_DIR).map(parseFrontMatter);
  const releases = (await (await fetch(GH_API)).json()).map(
    parseGitHubApiResponse,
  );
  const articles = [...news, ...releases];

  const articleTS = (a: NewsArticle): number => new Date(a.date).getTime();
  articles.sort((a, b) => articleTS(b) - articleTS(a));

  return {
    props: {
      articles,
    },
  };
}

const News = ({ articles }: Props) => (
  <MainLayout
    title="Project News"
    description="Follow the latest news and releases for the highlight.js project and its community"
  >
    <div className="container">
      <section>
        {articles.map((release) => (
          <BlurredBackground className="p-6 mb-8" key={release.title}>
            <header className="border-b border-solid border-white/3 mb-3 pb-2">
              <h2 className="text-3xl mb-0">
                {release.url ? (
                  <a href={release.url} className="text-cyan-300">
                    {release.title}
                  </a>
                ) : (
                  <span>{release.title}</span>
                )}
              </h2>
              <div className="flex items-center">
                <Timestamp timestamp={release.date} />
                <span className="mx-2">&middot;</span>
                <GitHubAvatar username={release.author} size={24} />
              </div>
            </header>

            <Markdown body={release.markdown} />
          </BlurredBackground>
        ))}
      </section>
    </div>
  </MainLayout>
);

export default News;
