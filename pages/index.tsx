import { CodeBlock } from '../components/codeblock';
import { HTMLTagsExample } from '../components/home/cdn-block';
import { LightBackground } from '../components/lightbackground';
import { MainLayout } from '../layouts/main';

import styles from '../styles/Home.module.scss'

const codeBlock = `
import Foundation

@objc class Person: Entity {
  var name: String!
  var age:  Int!

  init(name: String, age: Int) {
    /* /* ... */ */
  }

  // Return a descriptive string for this person
  func description(offset: Int = 0) -> String {
    return "\(name) is \(age + offset) years old"
  }
}`;

const Home = () => (
  <MainLayout>
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <ul className={styles.sellingPoints}>
            <li>189 languages and 95 styles</li>
            <li>Automatic language detection</li>
            <li>Multi-language code highlighting</li>
            <li>Available for node.js</li>
            <li>Works with any markup</li>
            <li>Compatible with any js framework</li>
          </ul>
          <p>
            <strong>Current release:</strong> v10.2.1
          </p>
        </div>
        <div className="col-md-6">
          <CodeBlock code={codeBlock} language="swift" />
        </div>
      </div>
    </div>

    <LightBackground>
      <h2 className="mb-4 text-center">
        Trusted by
      </h2>

      <ul className={`mb-3 ${styles.trustedBy}`}>
        <li>
          <img src="./stackoverflow.png" alt="Stackoverflow"/>
        </li>
        <li>
          <img src="./discord.png" alt="Discord"/>
        </li>
        <li>
          <img src="./vscode.png" alt="Visual Studio Code"/>
        </li>
      </ul>
    </LightBackground>

    <div className="container">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h2 className="text-center" id="usage">
            Usage
          </h2>

          <p>
            highlight.js can be used in different ways such using CDNs, hosting the bundle yourself, as a Vue plug-in,
            as ES6 modules, with Node.js, and web workers.
          </p>

          <p>See <a href="https://github.com/highlightjs/highlight.js#getting-started">our README on GitHub</a> for more details.</p>

          <h3 id="usage-as-html-tags">
            As HTML Tags
          </h3>

          <HTMLTagsExample className="my-4" version="10.6.0" />

          <p>
            This will find and highlight code inside of <code>&lt;pre&gt;&lt;code&gt;</code> tags; it tries to detect the language automatically. If automatic detection doesn’t work for you, you can specify the language in the class attribute:
          </p>

          <CodeBlock
            code={`<pre><code class="html">...</code></pre>`}
            language="html"
          />
        </div>
      </div>
    </div>
  </MainLayout>
);

export default Home;
