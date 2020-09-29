import { CodeBlock } from '../components/codeblock';
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
      <h2 className="text-center m-0">
        Usage
      </h2>
    </div>
  </MainLayout>
);

export default Home;
