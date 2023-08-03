import Link from 'next/link';
import React from 'react';

import ExternalLink from './external-link';
import { LightBackground } from './lightbackground';

interface LinkListProps {
  title: string;
  links: {
    href: string;
    title: string;
  }[];
}

const LinkList = ({ title, links }: LinkListProps) => (
  <div>
    <p className="font-bold mb-1">{title}</p>

    <ul className="pl-4">
      {links.map(({ href, title: linkName }) => {
        const isInternal = href.startsWith('/');
        const Tag = isInternal ? Link : ExternalLink;
        const extraProps = isInternal
          ? {}
          : {
              target: '_blank',
            };

        return (
          <li key={href}>
            <Tag
              {...extraProps}
              className="focus:underline hover:underline focus:text-cyan-300 hover:text-cyan-300"
              href={href}
            >
              {linkName}
            </Tag>
          </li>
        );
      })}
    </ul>
  </div>
);

export const Footer = () => (
  <footer>
    <LightBackground>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center md:text-left">
          Copyright &copy; {new Date().getFullYear()}
          <a
            href="https://www.netlify.com"
            className="block mt-3"
            target="_blank"
          >
            <img
              src="https://www.netlify.com/v3/img/components/netlify-dark.svg"
              className="mx-auto md:ml-0"
              alt="Deploys by Netlify"
            />
          </a>
        </div>
        <div>
          <LinkList
            title="The Project"
            links={[
              {
                href: 'https://github.com/orgs/highlightjs/people',
                title: 'The Team',
              },
              {
                href: 'https://github.com/highlightjs/highlight.js/graphs/contributors',
                title: 'Contributors',
              },
              {
                href: 'mailto:security@highlightjs.org',
                title: 'Security Vulnerabilities',
              },
              {
                href: 'https://github.com/highlightjs/highlightjs.org',
                title: 'Website Source',
              },
            ]}
          />
        </div>
        <div>
          <LinkList
            title="See us in action"
            links={[{ href: '/examples', title: 'Highlighting Previews' }]}
          />
        </div>
      </div>
    </LightBackground>
  </footer>
);
